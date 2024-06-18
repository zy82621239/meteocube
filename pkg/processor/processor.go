/*
**author:shihua
**coder:shihua
**designer:shihua
**email:15021408795@163.com
*/



/*
**load packages
*/
package processor
import "fmt"



/*
**interface
** - AbstractProcessorFactory
** - LocalProcessorFactory
**struct
** - Processor
**Method
** - Create_processor
*/



// Struct about processor
type Processor struct {
	Source string
	Transform string
	Sink string
}



// AbstractProcessorFactory
type AbstractProcessorFactory interface {
	create_processor()
}



// Struct about local processor factory
type LocalProcessorFactory struct {
	Property string
}



// Method about local processor
func (local_processor_factory *LocalProcessorFactory) Create_processor(source string,transform string,sink string) Processor {
	var local_processor Processor
	local_processor.Source = source
	local_processor.Transform = transform
	local_processor.Sink = sink
	fmt.Println("Create local processor well done!")
	return local_processor
}


