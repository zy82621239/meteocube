/*
**author:shihua
**coder:shihua
**designer:shihua
**email:15021408795@163.com
*/



package main

import "fmt"
import "processor"
import "source"
import "transform"
import "sink"



func main()  {
	// Test local processor
	fmt.Println("Starting creating local processor well done!")
	local_processor_factory := processor.LocalProcessorFactory{"property"}
	tmp_source := "source"
	tmp_transform := "transform"
	tmp_sink := "sink"
	local_processor := local_processor_factory.Create_processor(tmp_source,tmp_transform,tmp_sink)
	fmt.Println("Test local processor factory Property!",local_processor_factory.Property)
	fmt.Println("Test local processor Source!",local_processor.Source)
	// Test GFS source
	fmt.Println("Starting creating GFS source well done!")
	source_instance := source.Source{"Property"}
	gfs_source := source.GFSsource{source_instance}
	gfs_source.Obtian_data()
	fmt.Println("Test GFS source",gfs_source.Source.Property)
	// Test Arrow transform
	fmt.Println("Starting creating Arrow transform well done!")
	transform_isntance := transform.Transform{"Property"}
	arrow_transform := transform.ArrowTransform{transform_isntance}
	arrow_transform.Run()
	fmt.Println("Test Arrow transform",arrow_transform.Transform.Property)
	// Test Parquet sink
	fmt.Println("Starting creating Parquet sink well done!")
	sink_instance := sink.Sink{"Property"}
	parquet_sink := sink.ParquetSink{sink_instance}
	parquet_sink.Export_data()
	fmt.Println("Test Parquet sink",parquet_sink.Sink.Property)
}


