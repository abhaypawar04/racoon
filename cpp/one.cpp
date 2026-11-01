#include <iostream>
#include <string>
using namespace std;




class Student
{
	public :
	string name;
	int age;
	
	void display()
	{
		cout<<name<<endl;
		cout<<age<<endl;
		}
	};
	
	
	int main()
	{
		Student s1;
		Student s2;
		
		
		s1.name="abhay";
		s1.age=12;
		
		s2.name="2abhay";
		s1.age=122;
		
		s1.display();
		s2.display();
		
		return 0;
		
		}
