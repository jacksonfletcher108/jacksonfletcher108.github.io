#!/usr/bin/env python3
"""
Roblox video study kit.

Finds the top YouTube videos for each study topic, pulls their transcripts,
and packs them into one file per topic that you hand to Claude to study.

Built on the repos picked in ../research/github-repos.md:
  - yt-dlp                  search YouTube, fall back for captions, grab audio
  - youtube-transcript-api  fast caption download
  - faster-whisper          transcribe videos that have no captions (optional)

Usage (run from this folder):
  pip install -r requirements.txt
  python study.py search        # top 20 videos per topic -> ../research/videos/
  python study.py transcripts   # captions for every listed video -> transcripts/
  python study.py transcripts --whisper   # also transcribe videos with no captions
  python study.py pack          # one study file per topic -> packs/
  python study.py all           # all three steps

Then open Claude Code in this folder and paste PROMPT.md.

Note: YouTube blocks caption downloads from most cloud servers. Run the
transcripts step on your own computer or home internet. Search works anywhere.
"""

import argparse
import json
import math
import re
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOPICS_FILE = HERE / "topics.json"
VIDEOS_DIR = HERE.parent / "research" / "videos"
TRANSCRIPTS_DIR = HERE / "transcripts"
PACKS_DIR = HERE / "packs"
CACHE_DIR = HERE / "cache"


def load_topics():
    return json.loads(TOPICS_FILE.read_text(encoding="utf-8"))


# ---------------------------------------------------------------- search

def yt_search(query, n):
    """Return YouTube search results for a query (metadata only, no video download)."""
    import yt_dlp

    opts = {"quiet": True, "no_warnings": True, "extract_flat": True, "skip_download": True}
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(f"ytsearch{n}:{query}", download=False)
    return [e for e in (info.get("entries") or []) if e and e.get("id")]


def has_any(text, words):
    for w in words:
        w = w.lower()
        # short words like "ui" must match as a whole word, not inside "build"
        if len(w) <= 3:
            if re.search(rf"\b{re.escape(w)}\b", text):
                return True
        elif w in text:
            return True
    return False


def mostly_english(title):
    letters = [c for c in title if c.isalpha()]
    return not letters or sum(c.isascii() for c in letters) / len(letters) > 0.8


def on_topic(video, topic, everywhere=()):
    if not mostly_english(video.get("title", "")):
        return False
    text = f"{video.get('title', '')} {video.get('description', '')}".lower()
    if not has_any(text, topic["must_match"]):
        return False
    if topic.get("also_match") and not has_any(text, topic["also_match"]):
        return False
    return not has_any(text, list(everywhere) + topic.get("exclude", []))


def score(video):
    """Most-watched first, with a boost for showing up under several searches
    (a sign the video is squarely on the topic, not a lucky match)."""
    views = video.get("view_count") or 0
    return math.log10(views + 1) + 0.6 * (video["hits"] - 1)


def cmd_search(args):
    cfg = load_topics()
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    for topic in cfg["topics"]:
        if args.topic and args.topic not in topic["slug"]:
            continue
        print(f"\n== {topic['name']}")
        found = {}
        CACHE_DIR.mkdir(exist_ok=True)
        for q in topic["queries"]:
            cache = CACHE_DIR / (re.sub(r"[^a-z0-9]+", "-", q.lower()) + f"-{cfg['per_query']}.json")
            try:
                if args.cached and cache.exists():
                    results = json.loads(cache.read_text(encoding="utf-8"))
                else:
                    results = yt_search(q, cfg["per_query"])
                    cache.write_text(json.dumps(results, ensure_ascii=False), encoding="utf-8")
                    time.sleep(1)
            except Exception as e:  # keep going if one search fails
                print(f"   search failed for '{q}': {e}")
                continue
            print(f"   '{q}': {len(results)} results")
            for rank, e in enumerate(results, 1):
                v = found.setdefault(e["id"], {
                    "id": e["id"],
                    "url": f"https://www.youtube.com/watch?v={e['id']}",
                    "title": e.get("title") or "",
                    "channel": e.get("channel") or e.get("uploader") or "",
                    "view_count": e.get("view_count") or 0,
                    "duration": e.get("duration") or 0,
                    "description": (e.get("description") or "").replace("\xa0", " ").strip(),
                    "hits": 0,
                    "best_rank": rank,
                    "queries": [],
                })
                v["hits"] += 1
                v["best_rank"] = min(v["best_rank"], rank)
                v["queries"].append(q)

        skip = set(topic.get("skip_ids", []))
        pool = [v for v in found.values()
                if v["id"] not in skip
                and cfg["min_seconds"] <= (v["duration"] or 0) <= cfg["max_seconds"]
                and on_topic(v, topic, cfg.get("exclude_everywhere", []))]
        pool.sort(key=score, reverse=True)
        top = pool[: cfg["keep"]]
        for i, v in enumerate(top, 1):
            v["rank"] = i
            v["score"] = round(score(v), 3)

        out = {"topic": topic["name"], "slug": topic["slug"], "queries": topic["queries"],
               "candidates_seen": len(found), "on_topic": len(pool),
               "fetched": time.strftime("%Y-%m-%d"), "videos": top}
        (VIDEOS_DIR / f"{topic['slug']}.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
        write_markdown_list(out)
        print(f"   kept top {len(top)} of {len(pool)} on-topic videos ({len(found)} seen)")


def fmt_duration(s):
    s = int(s or 0)
    return f"{s // 3600}:{s % 3600 // 60:02d}:{s % 60:02d}" if s >= 3600 else f"{s // 60}:{s % 60:02d}"


def fmt_views(n):
    n = n or 0
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.0f}K"
    return str(n)


def write_markdown_list(out):
    lines = [f"# Top {len(out['videos'])}: {out['topic']}", "",
             f"Pulled from YouTube search on {out['fetched']} with `study.py search`. "
             f"{out['candidates_seen']} videos seen across {len(out['queries'])} searches, "
             f"{out['on_topic']} on topic, ranked by views with a boost for showing up under several searches.", "",
             "Searches: " + ", ".join(f"`{q}`" for q in out["queries"]), "",
             "| # | Video | Channel | Views | Length |", "|---|---|---|---|---|"]
    for v in out["videos"]:
        title = v["title"].replace("|", "/")
        lines.append(f"| {v['rank']} | [{title}]({v['url']}) | {v['channel']} | {fmt_views(v['view_count'])} | {fmt_duration(v['duration'])} |")
    (VIDEOS_DIR / f"{out['slug']}.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- transcripts

class Blocked(Exception):
    pass


def captions_api(video_id):
    from youtube_transcript_api import YouTubeTranscriptApi
    from youtube_transcript_api._errors import RequestBlocked, IpBlocked

    try:
        t = YouTubeTranscriptApi().fetch(video_id, languages=["en", "en-US", "en-GB"])
    except (RequestBlocked, IpBlocked) as e:
        raise Blocked(str(e).strip().splitlines()[0]) from e
    return " ".join(s.text.replace("\n", " ") for s in t)


def captions_ytdlp(video_id):
    import yt_dlp

    tmp = TRANSCRIPTS_DIR / "_tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    opts = {"quiet": True, "no_warnings": True, "skip_download": True,
            "writesubtitles": True, "writeautomaticsub": True,
            "subtitleslangs": ["en", "en-US", "en-orig"], "subtitlesformat": "json3",
            "outtmpl": str(tmp / "%(id)s.%(ext)s")}
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
    except Exception as e:
        if "not a bot" in str(e) or "429" in str(e):
            raise Blocked("YouTube asked to confirm this is not a bot") from e
        raise
    for f in sorted(tmp.glob(f"{video_id}*.json3")):
        data = json.loads(f.read_text(encoding="utf-8"))
        words = []
        for ev in data.get("events", []):
            for seg in ev.get("segs", []) or []:
                words.append(seg.get("utf8", ""))
        f.unlink()
        text = re.sub(r"\s+", " ", "".join(words)).strip()
        if text:
            return text
    return None


def whisper_transcribe(video_id, model_size):
    import yt_dlp
    from faster_whisper import WhisperModel

    tmp = TRANSCRIPTS_DIR / "_tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    opts = {"quiet": True, "no_warnings": True, "format": "bestaudio/best",
            "outtmpl": str(tmp / f"{video_id}.%(ext)s")}
    with yt_dlp.YoutubeDL(opts) as ydl:
        ydl.download([f"https://www.youtube.com/watch?v={video_id}"])
    audio = next(tmp.glob(f"{video_id}.*"))
    model = WhisperModel(model_size, device="auto", compute_type="int8")
    segs, _ = model.transcribe(str(audio), beam_size=5, vad_filter=True)
    text = " ".join(s.text.strip() for s in segs)
    audio.unlink()
    return text


def listed_videos(topic_filter=None):
    for f in sorted(VIDEOS_DIR.glob("*.json")):
        data = json.loads(f.read_text(encoding="utf-8"))
        if topic_filter and topic_filter not in data["slug"]:
            continue
        yield data


def cmd_transcripts(args):
    TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)
    done = failed = 0
    for data in listed_videos(args.topic):
        print(f"\n== {data['topic']}")
        for v in data["videos"]:
            out = TRANSCRIPTS_DIR / f"{v['id']}.txt"
            if out.exists() and out.stat().st_size > 200:
                done += 1
                continue
            text, how = None, ""
            try:
                text, how = captions_api(v["id"]), "captions"
            except Blocked as e:
                print(f"   BLOCKED: {e}")
                print("   YouTube is blocking caption downloads from this network.")
                print("   Run this step on your own computer / home internet instead.")
                return False
            except Exception:
                try:
                    text, how = captions_ytdlp(v["id"]), "auto-captions"
                except Blocked as e:
                    print(f"   BLOCKED: {e}. Run this step from home internet.")
                    return False
                except Exception:
                    text = None
            if not text and args.whisper:
                try:
                    text, how = whisper_transcribe(v["id"], args.model), f"whisper-{args.model}"
                except Exception as e:
                    print(f"   whisper failed for {v['id']}: {e}")
            if text:
                header = f"# {v['title']}\n# {v['channel']} | {v['url']} | via {how}\n\n"
                out.write_text(header + text + "\n", encoding="utf-8")
                done += 1
                print(f"   ok  {v['rank']:>2}. {v['title'][:70]}  ({how}, {len(text.split())} words)")
            else:
                failed += 1
                print(f"   --  {v['rank']:>2}. {v['title'][:70]}  (no captions; try --whisper)")
            time.sleep(args.delay)
    print(f"\n{done} transcripts ready, {failed} missing.")
    return True


# ---------------------------------------------------------------- pack

def cmd_pack(args):
    PACKS_DIR.mkdir(parents=True, exist_ok=True)
    for data in listed_videos(args.topic):
        parts = [f"# Study pack: {data['topic']}", "",
                 f"Top {len(data['videos'])} YouTube videos on this topic, with full transcripts.", ""]
        have = 0
        for v in data["videos"]:
            t = TRANSCRIPTS_DIR / f"{v['id']}.txt"
            parts.append(f"\n---\n\n## {v['rank']}. {v['title']}\n{v['channel']} | {fmt_views(v['view_count'])} views | {v['url']}\n")
            if t.exists():
                have += 1
                body = t.read_text(encoding="utf-8").split("\n\n", 1)[-1]
                parts.append(body)
            else:
                parts.append("(no transcript; description only)\n\n" + (v.get("description") or ""))
        (PACKS_DIR / f"{data['slug']}.md").write_text("\n".join(parts) + "\n", encoding="utf-8")
        print(f"packs/{data['slug']}.md  ({have}/{len(data['videos'])} with transcripts)")
    print("\nNext: open Claude Code in this folder and paste PROMPT.md.")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    for name in ("search", "transcripts", "pack", "all"):
        s = sub.add_parser(name)
        s.add_argument("--topic", help="only this topic (any part of its slug, e.g. 'ui' or 'monet')")
        if name in ("search", "all"):
            s.add_argument("--cached", action="store_true", help="reuse the last search results in cache/ instead of searching again")
        if name in ("transcripts", "all"):
            s.add_argument("--whisper", action="store_true", help="transcribe videos with no captions (slow, downloads audio)")
            s.add_argument("--model", default="small.en", help="whisper model size (tiny.en, base.en, small.en, medium.en)")
            s.add_argument("--delay", type=float, default=1.5, help="seconds to wait between videos")
    args = p.parse_args()
    if args.cmd in ("search", "all"):
        cmd_search(args)
    if args.cmd in ("transcripts", "all"):
        cmd_transcripts(args)
    if args.cmd in ("pack", "all"):
        cmd_pack(args)


if __name__ == "__main__":
    main()
