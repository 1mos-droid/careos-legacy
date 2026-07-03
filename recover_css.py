import json
import re

log_path = "/home/admin/.gemini/antigravity-cli/brain/a0f61262-73dc-4c48-9f4e-7ccc5e0c6aed/.system_generated/logs/transcript.jsonl"

largest_content = ""
largest_len = 0

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Check if this step has tool_calls with index.css content
            if "tool_calls" in data:
                for tc in data["tool_calls"]:
                    if tc["name"] in ["write_to_file", "replace_file_content", "multi_replace_file_content"]:
                        args = tc.get("args", {})
                        if isinstance(args, str):
                            try:
                                args = json.loads(args)
                            except:
                                continue
                        
                        target = args.get("TargetFile", "")
                        content = args.get("CodeContent", "") or args.get("ReplacementContent", "")
                        if "index.css" in target and len(content) > largest_len:
                            largest_content = content
                            largest_len = len(content)
                            
            # Check if this step is a view_file output containing index.css
            if data.get("type") == "VIEW_FILE":
                content = data.get("content", "")
                if "File Path:" in content and "index.css" in content:
                    # Clean up the line number annotations (e.g. "1: @import ...")
                    lines = content.split('\n')
                    cleaned_lines = []
                    for l in lines:
                        match = re.match(r'^\s*\d+:\s*(.*)', l)
                        if match:
                            cleaned_lines.append(match.group(1))
                    cleaned_text = '\n'.join(cleaned_lines)
                    if len(cleaned_text) > largest_len:
                        largest_content = cleaned_text
                        largest_len = len(cleaned_text)
        except Exception as e:
            pass

print(f"Largest index.css recovered: {largest_len} bytes")
if largest_content:
    with open("/home/admin/Projects/careos-local/frontend/src/index.css.recovered", "w", encoding="utf-8") as out:
        out.write(largest_content)
    print("Saved to index.css.recovered")
else:
    print("No CSS recovered")
