package data

type Component struct {
	Id          string `json:"id"`
	CreatedTime string `json:"createdTime"`
	UpdateTime  int    `json:"updateTime"` //最后更新时间
}

func findById[T interface{ []Component }](c T, id string) Component {
	for i := 0; i < len(c); i++ {
		if id == c[i].Id {
			return c[i]
		}
	}
	return Component{}
}
