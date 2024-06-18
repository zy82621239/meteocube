package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"io"
	"fmt"
	// "reflect"
)



func main() {
	r := gin.Default()
	r.GET("/meteocube/",func(c *gin.Context) {
		latitude := c.Query("latitude")
		longitude := c.Query("longitude")
		current := c.Query("current")
		hourly := c.Query("hourly")
		open_meteo_api := fmt.Sprintf("https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&hourly=%s",latitude,longitude,hourly)
		resp,err := http.Get(open_meteo_api)
		if err != nil {
			fmt.Println("http get failed:",err)
			return
		}
		defer resp.Body.Close()
		respBody,err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println("read response body failed:",err)
		}
		fmt.Println("http get succeed:",string(respBody))
		c.JSON(http.StatusOK,gin.H{"latitude":latitude,
								   "longitude":longitude,
								   "current":current,
								   "hourly":hourly,
								   "response":string(respBody)})
		})
	r.Run(":5000")
}