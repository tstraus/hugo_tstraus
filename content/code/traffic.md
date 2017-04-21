+++
date = "2017-04-21T09:51:47-04:00"
title = "Crappy Traffic Sim (C++)"
Description = ""
Categories = []
Tags = []

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

I wrote this late one night where I went down the rabbit hole of simulating traffic. It has each vehicle as its own thread, which is completely unnecessary for what it currently does. Right now the vehicles are given an average speed and its speed is modified with some noise, and does some basic collision detection. 

The idea is to eventually develop and train a simple neural network to drive each vehicle. In order to do this I started trying to write my own very simple neural network library.

<iframe src="https://ghbtns.com/github-btn.html?user=tstraus&repo=Traffic_Stuff&type=star&count=false&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>

#### Vehicle.h
~~~cpp
#ifndef __TRAFFIC_STUFF_VEHICLE_H__
#define __TRAFFIC_STUFF_VEHICLE_H__

#include <thread>
#include <mutex>

using namespace std;

class Vehicle
{
public:
    Vehicle(double avgVelocity, double startingDistance = 0.0, unsigned char startingLane = 0, unsigned int updateRate = 50);

    ~Vehicle();

    void drive();

    void stopThread();

    double velocity;

    struct {
        double distance;

        unsigned char lane;
    } location;

private:
    void driveLoop(bool asdf);

    double avgVelocity;

    unsigned int updateRate;

    thread* driveThread;

    bool threadShouldBeRunning;

    mutex mux;
};

#endif //__TRAFFIC_STUFF_VEHICLE_H__
~~~

-------------------------------------------------

#### Vehicle.cpp
~~~cpp
#include <iostream>
#include <random>

#include "Vehicle.h"

using namespace std;

Vehicle::Vehicle(double avgVelocity, double startingDistance, unsigned char startingLane, unsigned int updateRate)
{
    //cout << "Vehicle()" << endl;

    threadShouldBeRunning = false;

    mux.lock();
    velocity = avgVelocity;
    this->avgVelocity = avgVelocity;
    location.distance = startingDistance;
    location.lane = startingLane;
    this->updateRate = updateRate;
    mux.unlock();
}

Vehicle::~Vehicle()
{
    //cout << "~Vehicle()" << endl;
}

void Vehicle::drive()
{
    mux.lock();
    threadShouldBeRunning = true;
    mux.unlock();

    driveThread = new thread(&Vehicle::driveLoop, this, true);
}

void Vehicle::stopThread()
{
    mux.lock();
    threadShouldBeRunning = false;
    mux.unlock();

    driveThread->join();
}

void Vehicle::driveLoop(bool asdf)
{
    //cout << "driveLoop()" << endl;

    long long int seed = chrono::system_clock::now().time_since_epoch().count();
    default_random_engine engine((unsigned int)seed);
    normal_distribution<double> nextVelocity(avgVelocity, 1);

    while (threadShouldBeRunning)
    {
        chrono::system_clock::time_point start = chrono::system_clock::now();

        mux.lock();
        location.distance += velocity * (updateRate / 3600000.0);
        velocity = nextVelocity(engine);
        mux.unlock();

        this_thread::sleep_until(start + chrono::milliseconds(updateRate));
    }
}
~~~

-------------------------------------------------
#### main.cpp
~~~cpp
#include <cmath>
#include <iostream>
#include <vector>
#include <fstream>

#include "Vehicle.h"
#include "json.hpp"

using namespace std;
using json = nlohmann::json;

int main()
{
    vector<Vehicle*> vehicles;

    ifstream file("Vehicles.json");
    json config;
    file >> config;

    for (auto& vehicle: config["vehicles"])
        vehicles.push_back(new Vehicle(vehicle["avgVelocity"], vehicle["startingDistance"], vehicle["startingLane"], vehicle["updateRate"]));

   for (auto& vehicle : vehicles)
        vehicle->drive();

    unsigned int first, second;
    bool collision = false;
    pair<unsigned int, unsigned int> collidedVehicles;

    while (!collision)
    {
        chrono::system_clock::time_point start = chrono::system_clock::now();

        first = 1;
        for (auto& vehicle: vehicles)
        {
            cout << "location: " << vehicle->location.distance << "mi\n";

            second = 1;
            for (auto& i: vehicles)
            {
                if (vehicle != i && vehicle->location.lane == i->location.lane && abs(vehicle->location.distance - i->location.distance) < 0.00287247) // length of a mid-size sedan in miles
                {
                    collidedVehicles.first = first;
                    collidedVehicles.second = second;
                    collision = true;
                }

                second++;
            }

            first++;
        }

        cout << endl;

        this_thread::sleep_until(start + chrono::milliseconds(50));
    }

    for (auto& vehicle: vehicles)
        vehicle->stopThread();

    cout << "Collision between vehicle " << collidedVehicles.second << " and vehicle " << collidedVehicles.first << endl;

    for (auto& vehicle: vehicles)
        cout << "location: " << vehicle->location.distance << "mi" << endl;

    return 0;
}
~~~
