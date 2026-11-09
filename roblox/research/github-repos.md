# Step 1: the best GitHub repos for studying YouTube videos

*Researched 2026-11-09 with the GitHub search API. Star counts were taken that day. Raw results are in the two lists at the bottom.*

I searched GitHub for YouTube transcripts, summarizers, downloaders, speech-to-text, and YouTube MCP servers and skills. Then I ranked the results by what studying videos actually needs: **find the videos → get the words → feed the words to Claude**.

## The picks (what the study kit uses)

| Job | Repo | Stars | License | Why this one |
|---|---|---|---|---|
| Find the top videos | [yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp) | 206K | Unlicense | The standard tool for YouTube. Search returns views, length, and channel without downloading anything. It's also the fallback for captions and audio. Updated weekly. |
| Get the words (fast) | [jdepoix/youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) | 8.6K | MIT | Pulls a video's captions, including auto-captions, in under a second. No API key, no browser. |
| Get the words (no captions) | [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | 26.6K | MIT | Whisper speech-to-text, about 4× faster than the original on a normal CPU. Used only when a video has no captions. |

These three make up [`../study-kit/study.py`](../study-kit/study.py).

### How they did here
- **yt-dlp search: worked.** It produced the six top-20 lists in [`videos/`](videos/) (about 750 search results read, 120 kept).
- **faster-whisper: worked.** It transcribed the TikTok this whole project came from (`small.en` model, CPU).
- **Captions: blocked on this server.** YouTube answers cloud-server requests with "Sign in to confirm you're not a bot", for both youtube-transcript-api and yt-dlp. The youtube-transcript-api README says this happens to nearly all cloud IPs. Getting around it means proxies or a logged-in account's cookies, which breaks YouTube's terms and can get the account banned, so I didn't. **From a home connection, the kit gets all 120 transcripts.** Run `python study.py transcripts`.

## Worth knowing about

| Repo | Stars | What it's good for |
|---|---|---|
| [openai/whisper](https://github.com/openai/whisper) | 112K | The original Whisper. Same accuracy as faster-whisper, but slower and heavier. |
| [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp) | 55K | Whisper in C++. The fastest choice on a Mac (uses the GPU through Metal). |
| [m-bain/whisperX](https://github.com/m-bain/whisperX) | 25K | Word-level timestamps and who's-speaking labels. More than this project needs. |
| [danielmiessler/Fabric](https://github.com/danielmiessler/Fabric) | 44.6K | Has a `yt` transcript helper and the well-known `extract_wisdom` prompt pattern. Its prompts shaped [`../study-kit/PROMPT.md`](../study-kit/PROMPT.md). |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | 110K | Lets an AI agent read YouTube, Reddit, X, and more. Broad and heavy; overkill here. |
| [kimtaeyoon83/mcp-server-youtube-transcript](https://github.com/kimtaeyoon83/mcp-server-youtube-transcript) | 603 | MCP server: Claude Code fetches transcripts itself while chatting. Setup is in the study kit README. |
| [jkawamoto/mcp-youtube-transcript](https://github.com/jkawamoto/mcp-youtube-transcript) | 495 | Same idea, written in Python (`uvx mcp-youtube-transcript`). Handles long videos in pages. |
| [Dicklesworthstone/bulk_transcribe_youtube_videos_from_playlist](https://github.com/Dicklesworthstone/bulk_transcribe_youtube_videos_from_playlist) | 696 | Whole playlist → Whisper transcripts. Good when a creator has a long series. |
| [nexmoe/VidBee](https://github.com/nexmoe/VidBee) | 11K | Desktop app: download, transcribe, summarize. Point-and-click instead of a command line. |
| [AgriciDaniel/youtube-scout](https://github.com/AgriciDaniel/youtube-scout) | 72 | A Claude Code skill that ranks videos for a topic. Needs a YouTube Data API key. |

## Why not the rest
- **Chrome-extension summarizers** (e.g. YouTube Summary with ChatGPT): one video at a time, by hand. We need 120.
- **Hosted transcript APIs** (Supadata, ZeroPointRepo/youtube-skills): work, but cost money per call and send your data to a third party. Fine as a backup if your home IP ever gets rate-limited.
- **Video-understanding models** (SlowFast, Video-LLaMA, Qwen-Omni): built to understand what's on screen, which needs a GPU. For advice videos, the transcript holds 95% of the value.

---

### Raw search results
- [`github_search.txt`](github_search.txt): top 10 by stars for 8 searches
- [`github_candidates.txt`](github_candidates.txt): the shortlist with stars, last push, and license
