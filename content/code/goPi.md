+++
Categories = []
Description = ""
Tags = []
date = "2016-05-21T09:41:33-04:00"
title = "Monte Carlo Estimation of Pi (GoLang)"

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

This program uses goroutines to calculate a Monte Carlo estimation of Pi. It randomly generates points and them checks if its inside the circle. The proportion of the points inside and the total points is then used to estimate Pi.

On an Intel 3770k, it accurately estimates Pi to 4 decimal digits using 1 trillion random points in just over 5 seconds.

~~~go
package main

import (
    "fmt"
    "math"
    "math/rand"
    "os"
    "runtime"
    "strconv"
    "sync"
    "time"
)

func monte_carlo_pi(radius float64, reps int, result *int, wait *sync.WaitGroup) {
    var x, y float64
    count := 0
    seed := rand.NewSource(time.Now().UnixNano())
    random := rand.New(seed)

    for i := 0; i < reps; i++ {
        x = random.Float64() * radius
        y = random.Float64() * radius

        if num := math.Sqrt(x*x + y*y); num < radius {
            count++
        }
    }

    *result = count
    wait.Done()
}

func main() {
    cores := runtime.NumCPU()
    runtime.GOMAXPROCS(cores)

    var wait sync.WaitGroup

    counts := make([]int, cores)

    samples, _ := strconv.Atoi(os.Args[1])

    start := time.Now()
    wait.Add(cores)

    for i := 0; i < cores; i++ {
        go monte_carlo_pi(100.0, samples/cores, &counts[i], &wait)
    }

    wait.Wait()

    total := 0
    for i := 0; i < cores; i++ {
        total += counts[i]
    }

    pi := (float64(total) / float64(samples)) * 4

    fmt.Println("Time: ", time.Since(start))
    fmt.Println("pi: ", pi)
    fmt.Println("")
}
~~~
