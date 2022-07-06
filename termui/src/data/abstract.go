package data

//表接口
type TableOper interface {
	add(TableField) bool
	dele()
	set()
}

//公共字段
type BaseLogData struct {
	Id          string `json:"id"`
	CreatedTime int64  `json:"createdTime"` //毫秒时间戳
	Name        string `json:"name"`
}

//表公共字段
type TableField struct {
	BaseLogData
	UpdateTime int64 `json:"updateTime"` //最后更新时间
}
