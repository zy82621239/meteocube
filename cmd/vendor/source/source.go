/*
**author:shihua
**coder:shihua
**designer:shihua
**email:15021408795@163.com
*/



/*
**load packages
*/
package source
import "fmt"



/*
**interface
** - AbstractSource
**struct
** - Source
** - GFSSource
*/



// AbstracSource
type AbstracSource interface {
	obtian_data()
}



// Struct about source
type Source struct {
	Property string
}



// Struct about GFS source
type GFSsource struct {
	Source Source
}



// Method about GFS source
func (GFSsource *GFSsource) Obtian_data() {
	fmt.Println("Obtain data from GFS source!")
}


