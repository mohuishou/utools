package main

import (
	"fmt"
	"strings"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

var db *gorm.DB

// InitDB 初始化数据库
func InitDB(file string) (err error) {
	db, err = gorm.Open("sqlite3", file)
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

	err = tx.Where("title <> ''").
		Where("url <> ''").
		Order("last_visit_time desc").
		Limit(50).
		Find(&urls).
		Error
	return
}
