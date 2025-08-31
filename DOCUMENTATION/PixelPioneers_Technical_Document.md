# Technical Document

## Project Name
TourNest

---

## General Objective
Develop an innovative digital platform that facilitates the connection between travelers and reliable accommodation/tourism options, incorporating artificial intelligence tools to personalize the user experience, optimize booking processes, and build trust through secure and accessible technological solutions.

---

## Specific Objectives
1. Unify the management of room and tour package reservations in a single system, avoiding errors such as overbooking and loss of information.
2. Implement an artificial intelligence module that suggests personalized tour packages based on each client's preferences, history, and profile.
3. Optimize payment control and financial reporting, offering automatic tools for tracking income, occupancy, and sales.
4. Improve the user experience through a friendly web interface that allows quick searches, real-time bookings, and instant confirmations.
5. Strengthen customer trust through automatic notifications, check-in/check-out alerts, payment confirmations, and verified reviews.
6. Provide added value to hotels and tour operators through dynamic promotion features (e.g., discounts on packages for long stays).
7. Expand the reach of the tourism business by connecting a global audience with local hotel and cultural offerings, promoting sustainable tourism development.

---

## Problem Statement
When planning a trip, people often organize all the details themselves: searching for hotels, booking tours, calculating transportation and meal expenses, and creating an approximate budget. However, this practice often leads to unexpected extra costs, either due to lack of knowledge of more economical options or the absence of tools that unify all the information.

In other cases, travelers choose to buy a complete tour package that includes accommodation, transportation, and activities. However, this process can also be tedious and exhausting, as it involves contacting several companies and browsing multiple websites to compare prices, check reviews, and ensure the chosen package fits their needs.

This scenario creates two major problems for users:
1. **Lack of centralized information**, forcing them to spend too much time searching and comparing.
2. **Difficulty optimizing the budget**, as there are no intelligent tools to adjust travel plans according to preferences and available resources.

From this need arises the proposal to develop a comprehensive digital platform that unifies hotels, tours, complete packages, and other tourism services in one place. This platform will allow users to filter by preferences, keywords, and budget, reducing uncertainty, extra costs, and wasted time when planning a trip.

---

## Project Scope
The project involves developing a digital platform that centralizes tourism offerings, allowing users to search, compare, and book packages, hotels, tours, and complementary services in one place. The solution will offer personalized filters, budget generation, and recommendations based on artificial intelligence to optimize travel planning and improve the user experience.

---

## User Stories
* As a traveler, I want to search and compare hotels, tours, and packages on a single platform to save time and avoid browsing multiple websites.
* As a user planning a trip, I want to generate an estimated budget based on my preferences to better control my expenses.
* As an indecisive traveler, I want to receive personalized recommendations with the help of AI to discover options that fit my tastes and needs.
* As a customer looking for deals, I want to apply filters by price, location, activities, and ratings to easily find the best option for me.
* As a tourist traveling in a group, I want to book several services in a single package to facilitate trip organization without relying on multiple reservations.
* As a frequent user, I want to save my previous and favorite trips to reuse plans or get inspired by past experiences.
* As a platform administrator, I want to manage the information of hotels, tours, and packages offered to keep the tourism offering up to date.

---

## Evidence of SCRUM Methodology Application
The evidence was documented in the file `evidenciasScrum.pdf`

### Product Owner
I am responsible for maximizing the value of the product that the development team builds for our client (Decameron, hotel).

#### Phase 0: Vision and Preparation (Pre-Scrum)
**1. Product Vision (Product Vision Board)**
* **For (Target Client):** Medium-sized hotels and their end customers who manage accommodation and tour packages separately.
* **That (Need):** They need a unified system that avoids overbooking, loss of information, and difficulties in cross-selling.
* **The Product is:** An integrated web reservation management platform.
* **What It Does:** Unifies room booking (with real-time availability) and the sale of tour packages in one system, with payment, customer, and report control.
* **Value:** Increases operational efficiency, reduces costly errors, increases revenue through combined packages, and improves customer experience.
* **Difference:** It is an all-in-one, affordable, and specific system for this market, unlike generic or separate solutions.

**2. Stakeholders and Interested Parties**
* **Main:** Hotel owner/manager.
* **Direct Users:** Receptionists, sales agents, administrators, and tour guides.
* **End Users:** Customers booking online.
* **Team:** Developers, designers, tester (your teammates).

**3. Initial Product Backlog (Epics and High-Level User Stories)**
**Epic 1: Room and Reservation Management**
* US1: As an administrator, I want to add, edit, and deactivate rooms (number, type, capacity, price) to keep an updated catalog.
* US2: As a customer, I want to search for available rooms by date and number of guests to find options that fit my needs.
* US3: As a tourist traveling in a group, I want to book several services in a single package to facilitate trip organization without relying on multiple reservations.
* US4: As a traveler, I want to search and compare hotels, tours, and packages on a single platform to save time and avoid browsing multiple websites.
* US5: As a user planning a trip, I want to generate an estimated budget based on my preferences to better control my expenses.
* US6: As a customer looking for deals, I want to apply filters by price, location, activities, and ratings to easily find the best option for me.
* US7: As an indecisive traveler, I want to receive personalized recommendations with the help of AI to discover options that fit my tastes and needs.

**Epic 2: Tour Package and Activity Management**
* US8: As a frequent user, I want to save my previous trips to reuse plans or get inspired by past experiences.
* US9: As a platform administrator, I want to manage the information of hotels, tours, and packages offered to keep the tourism offering up to date.
* US10: As a customer with a confirmed reservation, I want to view and add tour packages to my stay to plan my vacation.

**Epic 3: Payment Management**
* US11: As a system, I must record all payments (reservation, package) and update the reservation status (pending/confirmed/canceled).
* US12: As an owner, I want to generate income reports for rooms and packages to analyze finances.

**Epic 4: User and Role Management**
* US13: As a CEO, I want to assign roles (users, owners) to system users to control access to functions.

**4. Initial Prioritization (MoSCoW)**
* **MUST HAVE:** US1, US2, US4, US9, US11, US13. (Without these, the system does not work).
* **SHOULD HAVE:** US5, US6. (Valuable functionality for the first version).
* **COULD HAVE:** US8, US10, email alerts.
* **WON'T HAVE (for now):** US3, US7, US12, complex promotions, photo uploads.

---

#### Phase 1: Sprint Planning
Now, with the vision and preparation defined, I work with the development team to plan the first work cycle.

**1. Objective:** "At the end of this 1-week sprint, we want a customer to be able to search for an available room, make a reservation with tours and activities, and the system should prevent overbooking."
**2. Prioritized Backlog:** Read the user stories you prioritized as "MUST HAVE."
**3. Explain the "WHAT":** I discuss with my team and answer all their questions about the user stories. What data does a room need? What happens if a reservation is canceled?
**4. Negotiate and Refine:** The team will tell you how much of that work they can commit to. It's a negotiation, not an imposition.
**5. "DONE":** Make sure everyone understands when a user story is finished. For example: "Does 'finished' include testing? Does it include responsive design?" "Tester."

**Result in Planning:**
* A clear Sprint Goal ("Basic Functional Reservation").
* An agreed Sprint Backlog (the user stories selected for this sprint).
* Clear Acceptance Criteria for each user story.

---

#### Phase 2: During the Sprint
**1. Availability:** As Product Owner, I am available for the team to consult me with questions.
**2. Backlog Refinement (Backlog Grooming):** I take time to prepare the next sprint.
**3. Validate Completed Work (Acceptance Testing):** At the end of the sprint, the team should present the functional code according to what I requested and what the client (Decameron) wants.

---

#### Phase 3: Review and Retrospective
**Sprint Review (Demonstration):**
* As Product Owner, I am the main presenter.
* The finished functionality of the sprint is shown to stakeholders, based on the Sprint Goal. Explaining what was done and what was not, and collecting feedback. "As you can see, reservations can now be made. For the next sprint, we will add tour packages."

**Sprint Retrospective:**
* As Product Owner, I am an active participant.
* Together with the Scrum Master and the team, we analyze our process. "What went well? What can we improve?" As PO, you can give feedback like "I need to be more available for questions" or "The team understood the user stories very well."