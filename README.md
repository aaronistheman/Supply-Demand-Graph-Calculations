# Supply-Demand-Graph-Calculations

(Last updated: 09/11/2016)

About
-----

This web-based personal project allows the user to graph supply and
demand
for the products of an industry. The user will also
be able to apply settings (e.g. an excise tax, a tariff)
and to see calculations (e.g. consumer surplus, tax revenue).
I worked on it during the March of 2016 and (after a delay)
from June to September of 2016,
during the end of my first year at UC Davis.

I made it with HTML, CSS, JavaScript, jQuery, AngularJS, and QUnit.

Implementation-Specific Features
--------------------------------

* MVC (Model-View-Controller) format.

* Unit/integration tests with QUnit, including 182 assertions total.

* Style of JavaScript custom types that imitates C++ classes
(based on "The Principles of Object-Oriented JavaScript" by Nicholas C. Zakas).

* PiecewiseFunction custom type that uses interpolation on data points
supplied by the user (for supply/demand graphs) to make acceptably
accurate calculations.

* Riemann sums to approximate integrals for calculating
graph-dependent values such as consumer
surplus, using the interpolations facilitated by the aforementioned
PiecewiseFunction custom type.

User-Specific Features
----------------------

* The following supported economic concepts:
 * Domestic total revenue
 * Consumer/producer surplus
 * Tax on supply/demand
 * Subsidy on supply/demand
 * Price floor/ceiling
 * Tariff

* Graph of both supply and demand, based on data points,
with offset versions shown when a tax and/or subsidy is used.

* Where appropriate, use of lines to emphasize certain quantities
or prices (e.g. the current international price).

* User is only shown the options that make sense. For example,
if the user does not check the box for "Government", then he/she
will not be asked where the price floor is. (This is the limit
of my AngularJS use.)

How to Run Application
----------------------

Run index.html on a browser that supports HTML Canvas content.

How to Run Unit and Integration Tests
-------------------------------------

Run test.html on a modern browser.

Note on Terminology
-------------------

Throughout the code (specifically the comments), I sometimes say
the supply graph moves up/down, which may be deceptive, since
up/down corresponds to decrease/increase for the supply graph. (I
think the more accepted terms are "left" and "right", but these
terms would conflict with how the program offsets the graphs.)

Releases
--------

Latest release: v0.1

Please check the Releases section on GitHub for the latest information:
https://github.com/aaronistheman/Supply-Demand-Graph-Calculations/releases

Helpful Resources
-----------------

* "The Principles of Object-Oriented JavaScript" by Nicholas C. Zakas
* "HTML5 Canvas Cookbook" by Eric Rowell
* W3Schools.com
* QUnit API Documentation

Author
------

That is me, Aaron Kaloti, who, as of the time of writing this,
is about to become a second-year Computer Science and Engineering
student at UC Davis.

As of the time of writing,
all that I currently know about economics is from two AP Economics classes
I took a year ago in high school. Thus, there are certain situations in
which I suspect I did not do the right thing. (e.g. Setting the world
price above the domestic equilibrium price does nothing in the program.
However, regarding real life, I suspect that
doing so could increase domestic supply, but this scenario was not
covered in the AP curriculum, so I ignored it.)

Contact Information
-------------------

My email address: aarons.7007@gmail.com

My YouTube channel (in which I demonstrate my finished applications):
https://www.youtube.com/channel/UCHhcIcXErjijtAI9TWy7wNw/videos