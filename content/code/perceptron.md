+++
date = "2017-04-21T08:54:59-04:00"
title = "Single Neuron Perceptron (C++)"
Categories = []
Tags = []
Description = ""

+++

<link href="../../css/prism.css" rel="stylesheet"/>
<script src="../../scripts/prism.js"></script>

This is a basic implementation of a single neuron perceptron that can learn to act as AND, OR, and NAND gates in C++.

<iframe src="https://ghbtns.com/github-btn.html?user=tstraus&repo=perceptron&type=star&count=false&size=large" frameborder="0" scrolling="0" width="160px" height="30px"></iframe>

#### neuron.h
~~~cpp
#ifndef __NEURON_H__
#define __NEURON_H__

#include <vector>
#include <tuple>

using namespace std;

class Neuron
{
public:
	Neuron(int numberOfInputs);

	~Neuron() {};

	double forward(vector<bool> inputs);

	bool forwardBinary(vector<bool> inputs);

	bool forwardBinaryCheck(vector<bool> inputs, bool answer);

	bool train(vector<bool> inputs, bool answers);

private:
	vector<double> weights; // input weights
	
	vector<Neuron> inputs; // for future backpropagation
	
	vector<Neuron> outputs; // for futude backpropagation

	double threshold; // trigger threshold

	double learningRate; //  how aggressive to tune the above values
};

#endif // __NEURON_H__
~~~

-------------------------------------------------------

#### neuron.cpp
~~~cpp
#include <iostream>
#include <math.h>

#include "neuron.h"

using namespace std;

Neuron::Neuron(int numberOfInputs)
{
	for (int i = 0; i < numberOfInputs; i++)
		weights.push_back(1.0 / numberOfInputs);

	threshold = 0.9;
	learningRate = 0.01;
}

double Neuron::forward(vector<bool> inputs)
{
	if (inputs.size() == weights.size())
	{
		double sum = 0.0;
		for (int i = 0; i < inputs.size(); i++)
			sum += inputs[i] * weights[i];

		return tanh(sum);
	}
	
	return -1;
}

bool Neuron::forwardBinary(vector<bool> inputs)
{
	if (inputs.size() == weights.size())
	{
		if (forward(inputs) > threshold)
			return true;
	}

	return false;
}

bool Neuron::forwardBinaryCheck(vector<bool> inputs, bool answer)
{
	if (inputs.size() == weights.size())
	{
		bool result = forwardBinary(inputs);

		if (result == answer)
			return true;
	}
	
	return false;
}

bool Neuron::train(vector<bool> inputs, bool answer)
{
	if (inputs.size() == weights.size())
	{
		bool result = forwardBinary(inputs);

		for (int i = 0; i < inputs.size(); i++)
			weights[i] += learningRate * ((double)answer - (double)result) * (double)inputs[i];

		threshold -= learningRate * ((double)answer - (double)result);

		/*for (int i = 0; i < weights.size(); i++)
			cout << "Weight " << i << ": " << weights[i] << "\n";
		cout << "Threshold: " << threshold << "\n";*/

		if (result == answer)
			return true;
	}

	return false;
}
~~~

-------------------------------------------------

#### main.cpp
~~~cpp
#include "neuron.h"
#include "json.hpp"

#include <iostream>
#include <fstream>
#include <chrono>
#include <random>

using namespace std;
using json = nlohmann::json;

int main(int argc, char** argv)
{
	ifstream file("Answers.json");
	json answers;
	file >> answers;

	unsigned int seed = (unsigned int)chrono::system_clock::now().time_since_epoch().count();
	default_random_engine engine(seed);
	uniform_int_distribution<unsigned int> rand(0, 1);

	int numInputs = 3;
	unsigned int reps = 1000;

	Neuron neuron(numInputs);

	vector<bool> inputs;
	inputs.reserve(numInputs);
	vector<bool> results;
	inputs.reserve(reps);

	for (unsigned int i = 0; i < reps; i++)
	{
		for (int i = 0; i < numInputs; i++)
			inputs.push_back(rand(engine) != 0);

		bool answer = inputs[0];
		if (numInputs > 0)
		{
			for (int i = 1; i < numInputs; i++)
				//answer = answer || inputs[i]; // learn to be an OR gate
				answer = answer && inputs[i]; // learn to be an AND gate

			answer = !answer; // learn to be a NAND gate
		}

		results.push_back(neuron.train(inputs, answer));
		inputs.clear();
	}

	for (auto& result : results)
		cout << "result:  " << result << "\n";

	cout << "---------------------------------" << endl;
	// OR gate
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 0, 0 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 0, 1 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 1, 0 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 1, 1 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 0, 0 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 0, 1 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 1, 0 }, true) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 1, 1 }, true) << endl;

	// AND gate
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 0, 0 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 0, 1 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 1, 0 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 0, 1, 1 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 0, 0 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 0, 1 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 1, 0 }, false) << endl;
	//cout << "correct: " << neuron.forwardBinaryCheck({ 1, 1, 1 }, true) << endl;

	// NAND gate
	cout << "check: " << neuron.forwardBinaryCheck({ 0, 0, 0 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 0, 0, 1 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 0, 1, 0 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 0, 1, 1 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 1, 0, 0 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 1, 0, 1 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 1, 1, 0 }, true) << endl;
	cout << "check: " << neuron.forwardBinaryCheck({ 1, 1, 1 }, false) << endl;

	return 0;
}
~~~
