module meteocube

require (
	processor v0.0.1
	source v0.0.1
	transform v0.0.1
	sink v0.0.1
)

replace (
	processor => ../pkg/processor
	source => ../pkg/source
	transform => ../pkg/transform
	sink => ../pkg/sink
)

go 1.20
