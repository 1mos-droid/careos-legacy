import json
import re

log_path = "/home/admin/.gemini/antigravity-cli/brain/a0f61262-73dc-4c48-9f4e-7ccc5e0c6aed/.system_generated/logs/transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line_idx, line in enumerate(f):
        if "index.css" in line:
            try:
                data = json.loads(line)
                step_idx = data.get("step_index", line_idx)
                stype = data.get("type", "")
                
                # Check tool calls
                if "tool_calls" in data:
                    for tc in data["tool_calls"]:
                        name = tc.get("name", "")
                        args = tc.get("args", {})
                        if isinstance(args, str):
                            try:
                                args = json.loads(args)
                            except:
                                pass
                        target = args.get("TargetFile", "")
                        content = args.get("CodeContent", "") or args.get("ReplacementContent", "")
                        if "index.css" in target:
                            print(f"Step {step_idx} (Tool Call {name}): Target={target}, Content Length={len(content)}")
                            with open(f"/home/admin/Projects/careos-local/frontend/src/index.css.step{step_idx}", "w", encoding="utf-8") as out:
                                out.write(content)
                                
                # Check view file output
                if stype == "VIEW_FILE":
                    content = data.get("content", "")
                    if "index.css" in content:
                        print(f"Step {step_idx} (View File): Length={len(content)}")
                        lines = content.split('\n')
                        cleaned_lines = []
                        for l in lines:
                            match = re.match(r'^\s*\d+:\s*(.*)', l)
                            if match:
                                cleaned_lines.append(match.group(1))
                            else:
                                cleaned_lines.append(l)
                        cleaned_text = '\n'.join(cleaned_lines)
                        with open(f"/home/admin/Projects/careos-local/frontend/src/index.css.step{step_idx}", "w", encoding="utf-8") as out:
                            out.write(cleaned_text)
            except Exception as e:
                # print(f"Error parsing line {line_idx}: {e}")
                pass
