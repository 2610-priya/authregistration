# Simple PowerShell HTTP Web Server for static frontend files
$port = 3000
$dir = "c:\Users\rath7\Desktop\authregistration\frontend"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Local web server started at http://localhost:$port/" -ForegroundColor Green
Write-Host "Press Ctrl+C inside the terminal or stop the command execution to turn it off."

# Dynamic mime types map
$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".json" = "application/json"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $localPath = $request.Url.LocalPath
        
        # Default index.html routing
        if ($localPath -eq "/") {
            $localPath = "/index.html"
        }
        
        $file = Join-Path $dir $localPath
        
        if (Test-Path $file -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $response.ContentLength64 = $bytes.Length
            
            $ext = [System.IO.Path]::GetExtension($file).ToLower()
            if ($mimeTypes.ContainsKey($ext)) {
                $response.ContentType = $mimeTypes[$ext]
            } else {
                $response.ContentType = "application/octet-stream"
            }
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errorBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $errorBytes.Length
            $response.ContentType = "text/plain"
            $response.OutputStream.Write($errorBytes, 0, $errorBytes.Length)
        }
        $response.Close()
    } catch {
        # Silent ignore/keep listening
    }
}
