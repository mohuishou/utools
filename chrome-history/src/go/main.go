package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
)

const (
	defaultHistoryFile = "./mohuishou-chrom-histoty.db"
)

// getDefaultProfile 获取默认路径
func getDefaultProfile() string {
	switch runtime.GOOS {
	case "darwin":
		return os.Getenv("HOME") + "/Library/Application Support/Google/Chrome/Default"
	default:
		return os.Getenv("HOME") + "/AppData/Local/Google/Chrome/User Data/Default"
	}
}

func checkErr(err error) {
	if err != nil {
		panic(err)
	}
}

func main() {
	var (
		dbPath string
		query  string
		tmp    string
	)
	flag.StringVar(&dbPath, "p", "", "profile path")
	flag.StringVar(&query, "q", "", "query string split with space")
	flag.StringVar(&tmp, "t", "", "tmp dir")
	flag.Parse()
	if dbPath == "" {
		dbPath = getDefaultProfile()
	}

	historyFile = filepath.Join(tmp, defaultHistoryFile)

	dbPath = filepath.Join(dbPath, "History")

	_, err := CopyFile(historyFile, dbPath)
	checkErr(err)

	err = InitDB()
	checkErr(err)

	querys := strings.Split(query, " ")
	urls, err := Search(db, querys)

	b, err := json.Marshal(&urls)
	checkErr(err)

	fmt.Println(string(b))
}
