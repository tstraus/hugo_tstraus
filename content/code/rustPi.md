+++
date = "2017-04-15T17:37:05-04:00"
title = "Monte Carlo Estimation of Pi (Rust)"
Categories = []
Tags = []
Description = ""

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

This program uses futures to calculate pi using a monte carlo method. It randomly generates points and checks if they are inside of a unit circle. The proportion of the points inside and the total number of points are then used to estimate Pi.

<iframe src="https://ghbtns.com/github-btn.html?user=tstraus&repo=monte_carlo_pi_rust&type=star&count=false&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>

~~~rust
extern crate rand;
extern crate time;
extern crate num_cpus;
extern crate futures;
extern crate futures_cpupool;

use std::env;
use rand::Rng;
use time::PreciseTime;
use futures::Future;
use futures_cpupool::CpuPool;

fn main() {
    let start = PreciseTime::now();

    let args: Vec<String> = env::args().collect();
    let reps: u64 = args[1].parse().unwrap();
    let cpus = num_cpus::get();
    let pool = CpuPool::new_num_cpus();

    let mut futures = Vec::new();
    for _ in 0..cpus {
        let input_reps = reps / cpus as u64;
        let future = pool.spawn_fn(move || {
            let count = monte_carlo_pi(input_reps);
            let res: Result<u64, ()> = Ok(count);
            return res;
        });

        futures.push(future);
    }

    let mut total_count: u64 = 0;
    for future in futures {
        total_count = total_count + future.wait().unwrap();
    }

    let pi = total_count as f64 / reps as f64 * 4.0;

    let end = PreciseTime::now();

    println!("pi: {0}", pi);
    println!("runtime: {0}", start.to(end));

    std::process::exit(0);
}

fn monte_carlo_pi(reps: u64) -> u64 {
    let mut count = 0;
    let mut rng = rand::thread_rng();

    for _ in 0..reps {
        if in_unit_circle(rng.gen::<f64>(), rng.gen::<f64>()) {
            count += 1;
        }
    }

    return count;
}

fn in_unit_circle(x: f64, y: f64) -> bool {
    if x*x + y*y < 1.0 {
        return true;
    } else {
        return false;
    }
}
~~~
