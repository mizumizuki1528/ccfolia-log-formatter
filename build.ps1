# Build script: combine all files into a single HTML
$base = $PSScriptRoot
$srcDir = "$base\src"
$css = Get-Content "$srcDir\style.css" -Raw -Encoding UTF8
$i18n = Get-Content "$srcDir\i18n.js" -Raw -Encoding UTF8
$parser = Get-Content "$srcDir\parser.js" -Raw -Encoding UTF8
$app = Get-Content "$srcDir\app.js" -Raw -Encoding UTF8

# Read index.html
$html = Get-Content "$srcDir\index.html" -Raw -Encoding UTF8

# Replace external references with inline content using string Replace (not regex)
$html = $html.Replace('<link rel="stylesheet" href="style.css">', "<style>`n$css`n</style>")
$html = $html.Replace('<script src="i18n.js"></script>', "<script>`n$i18n`n</script>")
$html = $html.Replace('<script src="parser.js"></script>', "<script>`n$parser`n</script>")
$html = $html.Replace('<script src="app.js"></script>', "<script>`n$app`n</script>")

# Output
$distDir = "$base\dist"
if (!(Test-Path $distDir)) { New-Item -ItemType Directory -Path $distDir | Out-Null }

$outPath = "$distDir\ccfolia_log_formatter.html"
$utf8bom = New-Object System.Text.UTF8Encoding($true)
[System.IO.File]::WriteAllText($outPath, $html, $utf8bom)

Write-Host "Build complete: $outPath"
Write-Host "File size: $([math]::Round((Get-Item $outPath).Length / 1024, 1)) KB"
