# Study kit

Finds the top 20 YouTube videos for each topic, downloads their transcripts, and packs them into one file per topic for Claude to study. It's built on the repos picked in [`../research/github-repos.md`](../research/github-repos.md).

## Run it (on your own computer)

YouTube blocks transcript downloads from cloud servers, so the transcript step needs your home internet. The search step works anywhere.

```bash
cd roblox/study-kit
python3 -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python study.py search        # top 20 per topic -> ../research/videos/  (about 90 seconds)
python study.py transcripts   # 120 transcripts  -> transcripts/          (about 5 minutes)
python study.py pack          # 6 study packs    -> packs/
```

Then open Claude Code in `roblox/` and paste [`PROMPT.md`](PROMPT.md).

### Options
- `--topic ui` runs one topic only. Any part of the topic's name works: `retention`, `loops`, `monet`, `fun`.
- `search --cached` re-ranks the last search results without searching again. Use it after editing `topics.json`.
- `transcripts --whisper` transcribes videos that have no captions. It needs `pip install faster-whisper` and downloads each video's audio, so it's slow.
- `transcripts --model base.en` picks a smaller, faster Whisper model.

## Change what gets studied
Edit [`topics.json`](topics.json). Each topic has its searches plus three filters:
- `must_match`: the title or description needs at least one of these words.
- `also_match`: ...and at least one of these.
- `exclude`: ...and none of these.

`exclude_everywhere` applies to every topic, and `skip_ids` drops specific videos found by hand to be off-topic. Ranking is by views, with a boost for videos that show up under several searches.

## Let Claude Code read YouTube by itself (optional)
An MCP server lets Claude fetch a transcript mid-conversation ("summarize this video: <link>"). This also needs home internet:

```bash
claude mcp add youtube-transcript -- npx -y @kimtaeyoon83/mcp-server-youtube-transcript
```
