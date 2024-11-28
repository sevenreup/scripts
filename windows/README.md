## Find stuff touching your ports
CMD
```bash
netstat -a -b
```
Powershell
```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort YourPortNumberHere).OwningProcess
```
For the visual one just run `resmon.exe` and switch to the Network tab
## Port Reset
When windows does that annoying thing of blocking port access
