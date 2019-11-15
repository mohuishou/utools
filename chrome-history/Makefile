build_all: build_darwin build_linux build_win
	upx -9 search_*
build_linux:
	cd search && CC=x86_64-linux-musl-gcc CXX=x86_64-linux-musl-g++ GOARCH=amd64 GOOS=linux CGO_ENABLED=1 go build -ldflags "-linkmode external -extldflags -static" -o ../search_linux .
build_darwin:
	cd search && go build -o ../search_darwin .
build_win:
	cd search && GOOS=windows GOARCH=amd64 CC=x86_64-w64-mingw32-gcc CGO_ENABLED=1 go build  -o ../search_windows.exe .