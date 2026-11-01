
#include <iostream>
#include <string>
using namespace std;

class Student 
{
	public: 
		string name;
		int age;
		
		void display()
		{
			cout<<name<<endl
			cout<<age<<endl
		}
};

int main()
	{
		Student s1;
		Student *ptr = &s1;
	}
