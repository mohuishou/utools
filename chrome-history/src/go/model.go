package main

import (
	"fmt"
	"strings"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var (
	db          *gorm.DB
	historyFile string
)

// InitDB 初始化数据库
func InitDB() (err error) {
	db, err = gorm.Open("sqlite3", historyFile)
	return
}

// URL 访问历史
type URL struct {
	ID            uint   `json:"id"`
	URL           string `json:"url"`
	Title         string `json:"title"`
	VisitCount    int    `json:"visit_count"`
	TypedCount    int    `json:"typed_count"`
	LastVisitTime int64  `json:"last_visit_time"`
	Hidden        bool   `json:"hidden"`
}

// Search 搜索
func Search(tx *gorm.DB, queries []string) (urls []URL, err error) {
	for _, q := range queries {
		q = fmt.Sprintf("%%%s%%", strings.TrimSpace(q))
		if q != "" {
			tx = tx.Where("title like ? or url like ?", q, q)
		}

	}
	err = tx.Select("DISTINCT title, url").
		Where("title <> null").
		Where("title <> ''").
		Where("url <> null").
		Where("url <> ''").
		Order("last_visit_time desc").
		Limit(50).
		Find(&urls).
		Error
	return
}
