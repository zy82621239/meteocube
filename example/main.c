#include <stdio.h>
#include<stdlib.h>
#include<eccodes.h>


int main() {
    printf("Hello eccodes!");
    // get dataflow from file
    FILE *fp = fopen("/home/shihua/tulip/workspace/eccodes/gfs.t00z.sfluxgrbf001.grib2","rb");
    // create a new handle from a message in a file
    codes_handles* h = codes_handle_new_from_file(0,FILE,PRODUCT_GRIB,&err);
    // close all cache data
    codes_handle_delete(h);
    fclose(fp);
    printf("eccodes test well done!");
    return 0;
}


