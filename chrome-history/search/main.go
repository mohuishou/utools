package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"path/filepath"
	"strings"
)

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

	tmpFile := filepath.Join(tmp, "mohuishou-chrome-histoty.db")
	_, err := CopyFile(tmpFile, dbPath)
	checkErr(err)

	err = InitDB(tmpFile)
	checkErr(err)

	querys := strings.Split(query, " ")
	urls, err := Search(db, querys)

	b, err := json.Marshal(&urls)
	checkErr(err)
	fmt.Println(string(b))
}
