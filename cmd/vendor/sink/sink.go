/*
**author:shihua
**coder:shihua
**designer:shihua
**email:15021408795@163.com
*/



/*
**load packages
*/
package sink
import "fmt"



/*
**interface
** - AbstractSink
**struct
** - Sink
** - ParquetSink
*/



// AbstracSink
type AbstracSink interface {
	obtian_data()
}



// Struct about sink
type Sink struct {
	Property string
}



// Struct about parquet sink
type ParquetSink struct {
	Sink Sink
}



// Method about parquet sink
func (ParquetSink *ParquetSink) Export_data() {
	fmt.Println("Export data to parquet!")
}


