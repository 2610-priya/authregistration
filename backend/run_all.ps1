# run_all.ps1
# Automates local Maven/MongoDB environment setup and starts the services.

$ErrorActionPreference = "Stop"

# Set base directories
$BackendDir = Resolve-Path .
$MongoDir = "$BackendDir\.mongodb"
$MongoDataDir = "$MongoDir\data"
$MavenDir = "$BackendDir\.maven"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "           AuthSpace Environment Setup Script             " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. SETUP PORTABLE MONGODB
if (-not (Test-Path $MongoDir)) {
    New-Item -ItemType Directory -Path $MongoDir | Out-Null
    New-Item -ItemType Directory -Path $MongoDataDir | Out-Null
    
    $MongoZip = "$MongoDir\mongodb.zip"
    $MongoUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.6.zip"
    
    Write-Host "Downloading portable MongoDB Community Server (7.0.6)..." -ForegroundColor Yellow
    if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
        curl.exe -L -o $MongoZip $MongoUrl
    } else {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $MongoUrl -OutFile $MongoZip
    }
    
    Write-Host "Extracting MongoDB zip file..." -ForegroundColor Yellow
    Expand-Archive -Path $MongoZip -DestinationPath "$MongoDir\temp"
    
    # Move extracted files directly to $MongoDir
    $ExtractedBinDir = Get-ChildItem -Path "$MongoDir\temp" -Directory | Select-Object -First 1
    Get-ChildItem -Path $ExtractedBinDir.FullName | Move-Item -Destination $MongoDir
    
    # Cleanup
    Remove-Item -Path "$MongoDir\temp" -Recurse -Force | Out-Null
    Remove-Item -Path $MongoZip -Force | Out-Null
    
    Write-Host "MongoDB setup complete." -ForegroundColor Green
} else {
    Write-Host "Portable MongoDB already configured." -ForegroundColor Green
}

if (-not (Test-Path $MongoDataDir)) {
    New-Item -ItemType Directory -Path $MongoDataDir | Out-Null
}

# 2. SETUP PORTABLE MAVEN
if (-not (Test-Path $MavenDir)) {
    New-Item -ItemType Directory -Path $MavenDir | Out-Null
    
    $MavenZip = "$MavenDir\maven.zip"
    $MavenUrl = "https://dlcdn.apache.org/maven/maven-3/3.9.16/binaries/apache-maven-3.9.16-bin.zip"
    
    Write-Host "Downloading portable Apache Maven (3.9.16)..." -ForegroundColor Yellow
    if (Get-Command curl.exe -ErrorAction SilentlyContinue) {
        curl.exe -L -o $MavenZip $MavenUrl
    } else {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $MavenUrl -OutFile $MavenZip
    }
    
    Write-Host "Extracting Maven zip file..." -ForegroundColor Yellow
    Expand-Archive -Path $MavenZip -DestinationPath "$MavenDir\temp"
    
    # Move extracted files to $MavenDir
    $ExtractedMavenDir = Get-ChildItem -Path "$MavenDir\temp" -Directory | Select-Object -First 1
    Get-ChildItem -Path $ExtractedMavenDir.FullName | Move-Item -Destination $MavenDir
    
    # Cleanup
    Remove-Item -Path "$MavenDir\temp" -Recurse -Force | Out-Null
    Remove-Item -Path $MavenZip -Force | Out-Null
    
    Write-Host "Apache Maven setup complete." -ForegroundColor Green
} else {
    Write-Host "Portable Apache Maven already configured." -ForegroundColor Green
}

# 3. RUN MONGODB SERVER IN BACKGROUND
$MongodExe = "$MongoDir\bin\mongod.exe"
if (-not (Test-Path $MongodExe)) {
    Write-Error "Could not find mongod.exe at $MongodExe"
}

# Check if port 27017 is already listening
$PortCheck = Test-NetConnection localhost -Port 27017 -WarningAction SilentlyContinue
if ($PortCheck.TcpTestSucceeded) {
    Write-Host "An instance of MongoDB is already listening on port 27017. Skipping launch..." -ForegroundColor Yellow
} else {
    Write-Host "Starting MongoDB Community Server in the background on port 27017..." -ForegroundColor Yellow
    $MongoOutLog = "$MongoDir\mongod_out.log"
    $MongoErrLog = "$MongoDir\mongod_err.log"
    Start-Process -FilePath $MongodExe -ArgumentList "--dbpath `"$MongoDataDir`"" -NoNewWindow -RedirectStandardOutput $MongoOutLog -RedirectStandardError $MongoErrLog
    
    # Wait for MongoDB to start and listen on port 27017
    $TimeoutSecs = 15
    $Started = $false
    for ($i = 0; $i -lt $TimeoutSecs; $i++) {
        Start-Sleep -Seconds 1
        $Test = Test-NetConnection localhost -Port 27017 -WarningAction SilentlyContinue
        if ($Test.TcpTestSucceeded) {
            $Started = $true
            break
        }
    }
    
    if ($Started) {
        Write-Host "MongoDB started successfully and is listening on port 27017." -ForegroundColor Green
    } else {
        Write-Warning "MongoDB did not respond on port 27017 within $TimeoutSecs seconds. Check $MongoOutLog or $MongoErrLog for errors."
    }
}

# 4. START SPRING BOOT SERVER
$MvnCmd = "$MavenDir\bin\mvn.cmd"
if (-not (Test-Path $MvnCmd)) {
    Write-Error "Could not find mvn.cmd at $MvnCmd"
}

Write-Host "Compiling and launching Spring Boot Application on http://localhost:8080..." -ForegroundColor Cyan
& $MvnCmd spring-boot:run
