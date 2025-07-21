Liascope
Liascope is a JavaScript-based app that provides astrology enthusiasts with a user-friendly interface to explore their personal horoscope. Designed with the MVC (Model-View-Controller) pattern, it aims to offer easy-to-understand astrological insights for beginners. The app uses modern JavaScript features, such as ES6 syntax and Clean Code principles, to ensure maintainability and scalability.

Features
Provides astrology insights using the positions of the planets, houses, and aspects.

Displays charts and allows users to explore their personal horoscope.

Supports various astrological calculations, including retrograde planets and the true Moon Node.

Implements smooth scrolling behavior and interactive features.

Built with a clean, modular, and maintainable code structure.

Status
The app is currently a work in progress. While the core functionality is implemented, there are still improvements to be made. Future updates will focus on enhancing the user experience and adding more features. These updates will include:

Developing a responsive design to ensure the app works seamlessly on all devices.

Displaying current Moon phases to provide users with more astrological insights.

Adding explanations for the aspects, houses, and planetary positions to help users better understand their horoscope.

Architecture
The app is built following the MVC (Model-View-Controller) pattern, which separates the logic of the application into three interconnected components:

Model: Contains the data and business logic. For data storage, an object is used to manage the astrological data, such as the positions of the planets and other celestial bodies.

View: Handles the presentation layer, responsible for rendering the charts and user interface.

Controller: Manages the interaction between the model and the view, coordinating user input and updating the view accordingly.

Technologies Used
JavaScript (ES6)

HTML & CSS

APIs and third-party libraries

APIs and Libraries Used
This project utilizes the following open-source APIs and libraries:

Nominatim (OpenStreetMap) – Used for city location calculations via nominatim.openstreetmap.org.

License: Data Policy

TimeZoneDB – Used for timezone calculations via timezonedb.com.

License: TimeZoneDB Terms of Service

FreeAstrologyAPI – Used for retrograde planet calculations. Available at freeastrologyapi.com.

License: Custom license (check documentation on the site).

AstroChart (AstroDraw) – Used for generating SVG charts. Available at astrodraw.github.io.

License: MIT License

js_astro (astsakai) – Used for calculating the degrees of cusps and planets. Available on GitHub at astsakai/js_astro.

License: MIT License


Installation
To get started with Liascope, follow these simple steps:

Clone this repository to your local machine:

bash
git clone https://github.com/liaakin/liascope.git  
Open the index.html file in your browser.

Enjoy exploring your astrological insights!

License
This project is licensed under the MIT License. See the LICENSE file for more details.

Contributing
Feel free to open issues or submit pull requests if you find bugs or have suggestions for improvements. Your contributions are welcome!

Acknowledgements
Thanks to the developers of the APIs and libraries used in this project, which have made it possible to offer a seamless and interactive experience to users.

Special thanks to the open-source community for their ongoing contributions!
