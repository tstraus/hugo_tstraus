+++
Categories = []
Description = ""
Tags = []
date = "2016-05-21T08:41:34-04:00"
title = "Mutithreaded Sumation (GoLang)"

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

This was my first attempt to write something that uses the simplicity of threading in Go using goroutines. The number of threads is determined in the program and the run time is calculated.

The performance of Go is really shown off when I compared the times to a similar single threaded program written in Python. For the sum of 1 through 1 billion, Python's time was measured in minutes, and Go took less then a 10th of a second.

~~~go
package main

import (
    "fmt"
    "sync"
    "time"
    "runtime"
    )

func sum(low int, high int, result *int, wait *sync.WaitGroup) {
    sum := 0

    for i := low; i <= high; i++ {
        sum += i
    }
    //fmt.Println(sum)
    *result = sum
    wait.Done()
}

func main() {
    cores := runtime.NumCPU()
    runtime.GOMAXPROCS(cores)
    //fmt.Println(cores)
    var wait sync.WaitGroup
    subs := make([]int, cores)
    var max int
    min := 1
    /*var min int
    fmt.Scan(&min)*/
    fmt.Scan(&max)
    start := time.Now()
    wait.Add(cores)

    for i := 0; i < cores; i++ {
        go sum(min + (max / cores) * (i), (max / cores) * (i + 1), &subs[i], &wait)
        fmt.Println("go started")
    }

    wait.Wait()
    var sum int

    for i := 0; i < cores; i++ {
        sum += subs[i]
    }
    fmt.Println(sum)
    fmt.Println(time.Since(start))
}
~~~