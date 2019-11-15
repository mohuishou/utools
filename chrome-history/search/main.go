package main

import (
	"encoding/json"
	"flag"
	"fmt"
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

	// 初始化数据库
	hisDB, err := InitDB(tmp, dbPath, "History")
	checkErr(err)

	favDB, err := (InitDB(tmp, dbPath, "Favicons"))
	checkErr(err)

	querys := strings.Split(query, " ")
	urls, err := Search(hisDB, favDB, querys)

	b, err := json.Marshal(&urls)
	checkErr(err)
	fmt.Println(string(b))
}
