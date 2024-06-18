/*
**author:shihua
**coder:shihua
**designer:shihua
**email:15021408795@163.com
*/



/*
**load packages
*/
package transform
import "fmt"



/*
**interface
** - AbstractTransform
**struct
** - Transform
** - ArrowTransform
*/



// AbstracTransform
type AbstracTransform interface {
	obtian_data()
}



// Struct about transform
type Transform struct {
	Property string
}



// Struct about arrow transform
type ArrowTransform struct {
	Transform Transform
}



// Method about arrow transform
func (ArrowTransform *ArrowTransform) Run() {
	fmt.Println("Transform to arrow!")
}


