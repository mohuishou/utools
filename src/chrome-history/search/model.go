package main

import (
	"fmt"
	"path/filepath"
	"strings"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
)

// InitDB 初始化数据库
func InitDB(tmp, dir, filename string) (*gorm.DB, error) {
	tmpFile := filepath.Join(tmp, filename)
	_, err := CopyFile(tmpFile, filepath.Join(dir, filename))
	if err != nil {
		return nil, err
	}
	return gorm.Open("sqlite3", tmpFile)
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
	Icon          string `json:"icon"`
}

// Favicon icon url
type Favicon struct {
	ID  uint   `json:"id,omitempty"`
	URL string `json:"url,omitempty"`
}

// IconMapping 中间表
type IconMapping struct {
	PageURL string `json:"page_url,omitempty"`
	IconID  uint   `json:"icon_id,omitempty"`
}

// Search 搜索
func Search(hisDB, favDB *gorm.DB, queries []string) (urls []URL, err error) {
	for _, q := range queries {
		q = fmt.Sprintf("%%%s%%", strings.TrimSpace(q))
		if q != "" {
			hisDB = hisDB.Where("title like ? or url like ?", q, q)
		}
	}

	err = hisDB.Where("title <> ''").
		Where("url <> ''").
		Order("last_visit_time desc").
		Limit(50).
		Find(&urls).
		Error
	if err != nil {
		return
	}

	for i, url := range urls {
		var fav Favicon
		favDB.Joins("JOIN icon_mapping on icon_mapping.icon_id = favicons.id and page_url = ?", url.URL).Find(&fav)
		urls[i].Icon = fav.URL
	}
	return
}
