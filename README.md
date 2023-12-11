
# **Talent Management System**

The Talent Management System is an efficient solution for managing job postings and candidates. It includes a user-friendly interface for recruiters and candidates to browse job postings, submit applications, and track progress. The system features resume parsing, interview scheduling, feedback submission, and analytics to track recruitment metrics. The project aimed to streamline the hiring process and provide an effective solution for managing job postings and candidates.




## Tech Stack

**Client:** Angular, Angular Material

**Server:** Spring Boot

**Database:** H2 Database



## Features

- Resume Parsing
- Job Posting
- Candidate Management
- Analytics and Reporting
- Feedback Submission


## How to Use
There are two roles specified for logging into the app:

## 1. Admin
- Log in to the system using Admin credentials
- Create and manage job postings
- Review and process candidate applications
- Schedule interviews and provide feedback
- Access recruitment analytics and reports

## 2. Interviewer
- Log in to the system using Interviewer credentials
- Schedule interviews and provide feedback

## Installation and Setup 

### Installation

For installing the project you have to clone it from the bitbucket repository using the follwing command:
`git clone https://{your_bitbucket_username}@bitbucket.org/tecunique/talent-management.git`

### Setup

Once installed follow these steps

(1) Chekout to branch `feature/005/simple-login` using the command `git checkout feature/005/simple-login`

(2) Pull from the above mentioned branch using command `git pull origin feature/005/simple-login`

To make a build you have to open terminal in the parent folder and command `mvn clean package`. You can find jar file in the target file of microservices. Run the jar file by `java --jar {jar file name}`. Now you can run the project on `localhost:8181` 

## Modules in Spring Boot
1. Entity
2. DTO
3. Repository
4. Service
5. Controller
6. Exceptions
7. Messages
8. Config
9. Common

## 1. Entity
### i. Candidates Entity
The Candidates class is an entity class that represents a candidate in a Talent Management System (TMS). It is used to store information about job candidates, including their personal details, education, work experience, skills, and other relevant information.

#### Fields

The Candidates class contains the following fields:

- id: Auto-generated primary key representing the candidate's unique identifier.
- firstName: First name of the candidate. Capitalized and non-empty.
- lastName: Last name of the candidate. Capitalized and non-empty.
- email: Email address of the candidate. Should be in a valid email format.
- address: Embedded object representing the current and permanent addresses of the candidate.
- mobilePhone: Mobile phone number of the candidate. Non-empty.
- links: An array of links related to the candidate.
- employment: A list of Employment objects representing the candidate's work experience.
- education: Embedded object representing the candidate's highest education details.
- source: The source from which the candidate was referred or found.
- note: Additional notes or comments about the candidate.
- referral: Embedded object representing the name of the person who referred the candidate.
- job_id: Identifier of the job position the candidate is applying for.
- jobPosition: The associated JobPosition entity representing the job position the candidate is applying for.
- resume: The byte array representing the candidate's resume document.
- candidateCode: A unique code associated with the candidate.
- keySkills: An array of key skills possessed by the candidate.
- mayKnowSkills: An array of skills the candidate may know.
- totalExperience: Total years of work experience of the candidate.
- currentCTC: Current CTC (Cost to Company) of the candidate.
- expectedCTC: Expected CTC (Cost to Company) of the candidate.
- currentNoticePeriod: The current notice period of the candidate.
- workMode: The preferred work mode of the candidate (e.g., full-time, part-time).
- communicationSkills: A rating (0 to 10) representing the candidate's communication skills.
- stage: The current stage of the candidate's hiring process.
- round: The current round of the hiring process.
- notesByInterviewer: Additional notes provided by the interviewer during the interview process.
- candidateFeedback: A list of CandidateFeedback objects representing feedback provided by interviewers.
- enrolledDate: The date when the candidate was enrolled into the TMS.

To understand the complete functionality and usage of this entity, it is essential to consider the interactions with the associated classes (Employment, Education, JobPosition, CandidateFeedback, etc.) and the database.



### ii. Address Entity
The Address entity is an embeddable class that represents the address details of a candidate. It consists of two embedded objects, CurrentAddress and PermanentAddress, each representing the current and permanent addresses, respectively.

#### Fields
- currentAddress: An embedded object representing the current address details of the candidate.
- permanentAddress: An embedded object representing the permanent address details of the candidate.

### a. CurrentAddress and PermanentAddress Entities
Both CurrentAddress and PermanentAddress are embeddable classes representing the address details of the candidate's current and permanent addresses, respectively.

#### Fields
- currentCountry: The country of the current address.
- currentState: The state/province of the current address.
- currentCity: The city of the current address.
- permanentCountry: The country of the permanent address.
- permanentState: The state/province of the permanent address.
- permanentCity: The city of the permanent address.

### b. Country, State and City Entities
These entities represent geographical details such as countries, states/provinces, and cities. They are used to store location-related information of the candidates in the Talent Management System.

#### Country Fields
- id: Auto-generated primary key representing the country's unique identifier.
- name: The name of the country.
- nativeName: The native name of the country.
- states: A list of State objects representing the states/provinces within the country.

#### State Fields
- id: Auto-generated primary key representing the state's unique identifier.
- name: The name of the state/province.
- country: A reference to the Country entity representing the country to which the state belongs.
- cities: A list of City objects representing the cities within the state/province.

#### City Fields
- id: Auto-generated primary key representing the city's unique identifier.
- name: The name of the city.
- state: A reference to the State entity representing the state/province to which the city belongs.

These entities and embeddable classes together form the foundation for storing and managing address and geographical details in the Talent Management System. The relationships between entities allow for efficient retrieval and storage of candidate address information, as well as country, state, and city details.



### iii. Education Entity
The Education entity is an embeddable class that represents the educational qualifications of a candidate in the Talent Management System (TMS). It contains information about the candidate's highest degree, specialization, and the year of achievement.

#### Fields
- highestDegree: The highest educational degree obtained by the candidate (e.g., Bachelor's, Master's, Ph.D.).
- specialization: The area of specialization or major in the highest degree (if applicable).
- yearOfAchievement: The year in which the candidate achieved the highest educational degree. This field is annotated with @Temporal(TemporalType.DATE) to indicate that it represents a date without time information.

The Education entity serves as a container to hold educational information related to a candidate. It can be embedded within the Candidates entity to store the educational details of the candidates effectively. The @Embeddable annotation allows the Education class to be included as a part of another entity (Candidates) and share the same database table, reducing data duplication and improving data organization.



### iv. Employment Entity
The Employment entity represents the employment history or work experience of a candidate in the Talent Management System (TMS). It stores information about the candidate's past employments, including the company name, job designation, previous CTC (Cost to Company), location, working status, start date, finish date, and a reference to the associated candidate (Candidates entity).

#### Fields
- id: Auto-generated primary key representing the employment record's unique identifier.
- companyName: The name of the company where the candidate was previously employed.
- designation: The job designation or role held by the candidate in the previous employment.
- previousCTC: The previous CTC (Cost to Company) of the candidate in the previous employment.
- location: The location or city where the previous employment was based.
- workingStatus: The working status of the candidate during the previous employment (e.g., full-time, part-time, contract).
- start: The start date of the previous employment. This field is annotated with @Temporal(TemporalType.DATE) to indicate that it represents a date without time information.
- finish: The finish date of the previous employment. This field is annotated with @Temporal(TemporalType.DATE) to indicate that it represents a date without time information.
- candidates: A reference to the Candidates entity representing the candidate associated with this employment record. The @ManyToOne and @JoinColumn annotations define the relationship between Employment and Candidates, with candidates being the owning side of the relationship.

The Employment entity allows the TMS to keep track of a candidate's work experience history. By using the @ManyToOne relationship with the Candidates entity, each candidate can have multiple employment records associated with them. The @JsonIgnore annotation on the candidates field indicates that this field should be ignored during JSON serialization and deserialization to prevent potential circular reference issues.



### v. JobPosition Entity
The JobPosition entity represents a job position or job opening in the Talent Management System (TMS). It contains information about the job title, hiring managers, requirements, job status, job description, and a list of candidates associated with the job position.

#### Fields
- id: Auto-generated primary key representing the job position's unique identifier.
- jobTitle: The title or name of the job position.
- hiringManagers: An array of hiring managers responsible for the job position.
- requirements: The requirements or qualifications for the job position, stored as a string.
- jobStatus: The status of the job position (e.g., open, closed, on hold).
- jobDescription: The job description in the form of a byte array, potentially containing multimedia or other embedded data.
- candidates: A list of Candidates objects representing the candidates who have applied for or are associated with this job position. The @OneToMany annotation defines a one-to-many relationship between JobPosition and Candidates, with candidates being the non-owning side of the relationship.

The JobPosition entity allows the TMS to manage and track different job positions within the organization. It stores relevant information about each job position, including its title, requirements, and status. The list of candidates associated with a job position enables efficient management of job applications and the hiring process.




### vi. CandidateFeedback Entity

The CandidateFeedback entity represents the feedback provided by interviewers for a specific candidate during the interview process in the Talent Management System (TMS). It stores information about the candidate's name, date of the interview, position applied for, interviewer's details, ratings on various aspects, overall rating, comments, and the final result of the interview. Additionally, it contains a reference to the associated candidate (Candidates entity).

#### Fields
- id: Auto-generated primary key representing the feedback's unique identifier.
- candidateName: The name of the candidate for whom the feedback is provided.
- dateOfInterview: The date of the interview. This field is annotated with @Temporal(TemporalType.DATE) to indicate that it represents a date without time information.
- positionAppliedFor: The position for which the candidate applied during the interview.
- interviewer: The name of the interviewer who provided the feedback.
- round: The round of the interview for which the feedback is given.
- educationalBackgroundRating: Rating given by the interviewer on the candidate's educational background.
- workExperienceRating: Rating given by the interviewer on the candidate's work experience.
- technicalSkillsRating: Rating given by the interviewer on the candidate's technical skills.
- communicationSkillsRating: Rating given by the interviewer on the candidate's communication skills.
- candidateInterestRating: Rating given by the interviewer on the candidate's interest in the position or role.
- interpersonalSkillsRating: Rating given by the interviewer on the candidate's interpersonal skills.
- overallRating: Overall rating provided by the interviewer for the candidate.
- comments: Additional comments or feedback provided by the interviewer, stored as a string with a maximum length of 2000 characters.
- result: The final result of the interview (e.g., selected, rejected, pending).
- candidates: A reference to the Candidates entity representing the candidate associated with this feedback. The @ManyToOne and @JoinColumn annotations define the relationship between CandidateFeedback and Candidates, with candidates being the owning side of the relationship.

The CandidateFeedback entity allows the TMS to capture valuable feedback from interviewers regarding candidates' performance during the interview process. By linking the feedback to the associated candidate using the @ManyToOne relationship, the system can track and analyze candidate progress and make informed hiring decisions.



### vii. Referral Entity
The Referral entity is an embeddable class that represents the details of a candidate's referral in the Talent Management System (TMS). It contains information about the first name and last name of the person who referred the candidate to the organization.

#### Fields
- referred_fname: The first name of the person who referred the candidate to the organization.
- referred_lname: The last name of the person who referred the candidate to the organization.





## 2. DTO
### i. CandidateDetailsDto Class
The CandidateDetailsDto class is a Data Transfer Object (DTO) that represents a simplified view of a candidate's details in the Talent Management System (TMS). It is used to transfer candidate information between different layers of the application, such as from the backend to the frontend. The DTO includes selected candidate attributes for display or processing purposes.

#### Fields
- id: The unique identifier of the candidate.
- firstName: The first name of the candidate.
- lastName: The last name of the candidate.
- email: The email address of the candidate.
- address: An object representing the address details of the candidate (from the Address entity).
- enrolledDate: The date when the candidate was enrolled or added to the system.
- source: The source from which the candidate was referred or recruited.
- skills: An array containing the key skills of the candidate.
- mayKnowSkills: An array containing additional skills that the candidate may have.
- mobilePhone: The mobile phone number of the candidate.
- candidateCode: A unique code assigned to the candidate.
- education: An object representing the educational qualifications of the candidate (from the Education entity).
- currentNoticePeriod: The current notice period of the candidate.
- jobPosition: An object representing the job position associated with the candidate (from the JobPosition entity).
- workMode: The work mode or preference of the candidate (e.g., full-time, part-time, remote).
- expectedCTC: The expected Cost to Company (CTC) of the candidate.
- currentCTC: The current Cost to Company (CTC) of the candidate.
- totalExperience: The total work experience of the candidate in years.
- round: The round number or stage of the candidate in the hiring process.
- stage: The current stage of the candidate in the hiring process.

The CandidateDetailsDto class provides a concise representation of the candidate's relevant details, making it suitable for data transfer and presentation purposes. It allows the application to share specific candidate information without exposing the entire entity structure, promoting encapsulation and data privacy.



### ii. EmailResponseDTO Class

The EmailResponse class is a Data Transfer Object (DTO) used to represent the response of an email operation in the Talent Management System (TMS). It is used to transfer the outcome of an email operation, such as sending an email, from the backend to the frontend or other parts of the application.

#### Fields
- message: A string containing the message or status of the email operation.

The EmailResponse class provides a simple structure to convey the result of an email operation. For example, it can be used to communicate whether an email was sent successfully or if there was an error during the process. By encapsulating the response in this DTO, the application can handle email-related responses uniformly and efficiently.


### iii. JobPositionDTO Class
The JobPositionDto class is a Data Transfer Object (DTO) that represents a simplified view of a job position in the Talent Management System (TMS). It is used to transfer job position information between different layers of the application, such as from the backend to the frontend. The DTO includes selected attributes related to a job position for display or processing purposes.

#### Fields
- id: The unique identifier of the job position.
- jobTitle: The title or name of the job position.
- hiringManagers: An array containing the names or identifiers of hiring managers responsible for the job position.
- jobStatus: The status of the job position (e.g., open, closed, on hold).
- requirements: The requirements or qualifications for the job position, stored as a string.
- jobDescription: The job description in the form of a byte array, potentially containing multimedia or other embedded data.

The JobPositionDto class provides a concise representation of the relevant attributes of a job position, making it suitable for data transfer and presentation purposes. This DTO can be used to efficiently communicate job position data to different parts of the application, such as the frontend, where it can be presented to users or processed as needed.





## 3. Repository

### i. CandidateRepository Class
The CandidateRepository interface defines methods for accessing and managing candidate data in the Talent Management System (TMS) database. It extends the Spring Data JPA JpaRepository interface, which provides basic CRUD (Create, Read, Update, Delete) operations for the Candidates entity.

Here's a summary of the methods defined in the CandidateRepository interface:

- findCandidateById(Long id): Finds a candidate by their unique identifier (id).

- deleteById(Long id): Deletes a candidate with the given id.

- findByKeyword(String keyword, int page, int size): Searches for candidates based on a keyword, which can be matched against various candidate attributes. The method uses native SQL queries to perform the search, allowing flexibility in composing the search conditions. Pagination is applied to the results using the page and size parameters.

- findByKeywordAndJobId(String keyword, Long jobId, Pageable pageable): Similar to findByKeyword, but this method further filters the candidates based on their associated jobId. The results are paginated using the provided Pageable object.

- countCandidatesByJobId(Long jobId): Counts the number of candidates associated with a particular job position identified by its jobId.

- findAllWithRoundTwoOrMore(Pageable pageable): Retrieves candidates who have participated in a round with a value greater than or equal to 2. The results are paginated using the provided Pageable object.

- findAllWithRoundTwoOrMoreAndKeyword(String keyword, Pageable pageable): Similar to findAllWithRoundTwoOrMore, but this method further allows searching for candidates based on a keyword. The results are paginated using the provided Pageable object.


### ii. CountryRepository Class
The CountryRepository interface extends JpaRepository and provides basic CRUD operations for the Country entity. It allows you to perform operations like saving, updating, deleting, and querying countries in the database.

### iii. StateRepository Class
The StateRepository interface extends JpaRepository and provides basic CRUD operations for the State entity. Additionally, it includes a custom query method findStatesByCountry using a @Query annotation. This method retrieves a list of states associated with a given Country entity. The custom query allows you to search for states based on the specified Country.

### iv. CityRepository Class
The CityRepository interface extends JpaRepository and provides basic CRUD operations for the City entity. It also includes a custom query method findCitiesByState using a @Query annotation. This method retrieves a list of cities associated with a given State entity. The custom query allows you to search for cities based on the specified State.

These repositories allow you to perform various database operations related to countries, states, and cities, making it easier to manage and retrieve data related to geographical locations in the TMS application.


### v. JobPositionRepository Class
The JobPositionRepository interface extends JpaRepository and provides basic CRUD operations for the JobPosition entity in the TMS application. Methods defined in JobPositionRepository are:

- findJobPositionById(): This method allows you to retrieve a JobPosition entity from the database based on its unique identifier (id). It provides a convenient way to get a specific job position by its ID.

- deleteById(): This method is overridden from the JpaRepository interface. It allows you to delete a JobPosition entity from the database based on its unique identifier (id). When you call this method with a valid ID, it will remove the corresponding job position from the database.


### vi. CandidateFeedbackRepository Class

The CandidateFeedbackRepository interface extends JpaRepository and provides basic CRUD operations for the CandidateFeedback entity in the TMS application. Method defined in CandidateFeedbackRepository are:

- findByCandidatesId(): This method allows you to retrieve a list of CandidateFeedback entities from the database based on the unique identifier of the associated candidate (candidateId). It provides a convenient way to get all the feedback entries related to a specific candidate.

By using this repository interface, you can easily perform operations related to the CandidateFeedback entity, such as creating, reading, updating, and deleting candidate feedback entries in the TMS application. The JpaRepository provides a set of useful methods out-of-the-box, making it easier to manage and manipulate candidate feedback data in the database.



## 4. Service

### i. CandidateService Class

The CandidateService class is a service component that provides various methods to manage candidate-related operations in the TMS application. It uses the CandidateRepository, JobPositionRepository, and other repositories to interact with the database and perform CRUD operations.

Here's a summary of the main methods and functionalities provided by the CandidateService class:

- addCandidate: Adds a new candidate to the database. It generates a unique candidate code, sets the candidate for employment and feedback entities, and associates the candidate with a specific job position.

- getCandidateByName: Retrieves the full name of a candidate based on their unique identifier (ID).

- getCandidateByPosition: Retrieves the job ID of a candidate based on their unique identifier (ID).

- getCandidateById: Retrieves a candidate entity by its unique identifier (ID) or throws a ResourceNotFoundException if the candidate is not found.

- addCandidateFeedback: Adds candidate feedback for a specific candidate and associates it with the candidate and the position applied for.

Various methods to retrieve the total number of candidates, the number of candidates with specific stages (e.g., shortlisted, hired, on hold, rejected, inactive), and candidates matching specific criteria (location, CTC, experience, etc.).

- updateStage: Updates the stage of a candidate (e.g., from shortlisted to hired).

- getCandidatesWithStageAndKeywords: Retrieves candidates based on a specific stage and optional keywords.

- getCandidatesByJobPosition: Retrieves candidates associated with a specific job position.

- getResumeFileById: Retrieves the resume file of a candidate by their unique identifier (ID).

- CandidatesExcelExporter: A static inner class that provides utility methods to export candidate data to Excel files.

Overall, the CandidateService class serves as the bridge between the controllers and the repositories, handling the business logic and data manipulation required for candidate-related operations.


### ii. CountryStateCityService Class
The CountryStateCityService is a service component that provides methods to handle country, state, and city-related operations in the TMS application. It interacts with the CountryRepository, StateRepository, and CityRepository to perform CRUD operations and manage data related to countries, states, and cities.

Here's a summary of the main methods and functionalities provided by the CountryStateCityService class:

- saveCountryDataFromJson: Parses JSON data containing country, state, and city information and saves it to the database. It creates Country, State, and City entities from the JSON data and establishes the appropriate relationships between them.

- createCountryFromJson: Converts a JSON node containing country information to a Country entity.

- createStateFromJson: Converts a JSON node containing state information to a State entity and associates it with a specific Country.

- createCityFromJson: Converts a JSON node containing city information to a City entity and associates it with a specific State.

- getAllStatesForCountry: Retrieves a list of all states belonging to a specific country based on the country's unique identifier (ID).

- getAllCitiesForState: Retrieves a list of all cities belonging to a specific state based on the state's unique identifier (ID).

The service is designed to handle country, state, and city data import and retrieval, enabling other components or controllers in the application to interact with and display the geographical data as needed.


### iii. JobPositionService Class
The JobPositionService is a service component that provides methods to manage job positions in the TMS (Tecunique Talent Management System) application. It interacts with the JobPositionRepository and CandidateService to perform CRUD operations and retrieve data related to job positions and candidates.

Here's a summary of the main methods and functionalities provided by the JobPositionService class:

- getAllJobs: Retrieves a paginated list of all job positions available in the system. It takes parameters for pagination (pageNumber and pageSize), sorting (sortField and sortOrder), and returns a list of JobPositionDto objects containing job position data in a simplified form suitable for display.

- updateCandidateJobStatus: Updates the job status of a candidate associated with a specific job position. It takes the candidate's unique identifier (candidateId) and the new job status, then updates the JobPosition entity accordingly.

- getJobPositionById: Retrieves a specific job position based on its unique identifier (id) from the database.

- addJobPosition: Adds a new job position to the database by saving the provided JobPosition entity.

- deleteJobPosition: Deletes a job position with the given ID from the database. It performs the deletion within a transaction.

- updateJobPosition: Updates an existing job position with new information. It takes the job position's unique identifier (jobId) and the updated JobPosition entity. The method finds the existing job position, updates its fields with the new data, and saves the changes.

- getTotalNumberOfRecords: Retrieves the total number of job positions available in the database.

- convertEntityToDto: Converts a JobPosition entity into a JobPositionDto object, which represents a simplified version of the job position suitable for display.

The service is designed to handle job position-related operations, such as listing, adding, updating, and deleting job positions. It also supports interactions with candidates, such as updating their job status in relation to specific job positions.



### iv. CandidateFeedbackService Class
The CandidateFeedbackService is a service component responsible for handling candidate feedback-related operations in the Tecunique Talent Management System (TMS) application. It interacts with the CandidateFeedbackRepository to retrieve candidate feedback data from the database.

Here's a summary of the main method and functionality provided by the CandidateFeedbackService class:

- getCandidateFeedbackByCandidateId: Retrieves a list of candidate feedback objects based on the provided candidate's unique identifier (candidateId). The method calls the findByCandidatesId method of the CandidateFeedbackRepository to fetch all candidate feedback associated with the specified candidate.

The service simplifies the process of accessing candidate feedback data by encapsulating the repository interactions and providing a convenient method to retrieve feedback for a specific candidate.




### v. CandidatesExcelExporter Class
The CandidatesExcelExporter class is responsible for exporting candidate-related data to Excel files. It provides three methods for exporting different types of data:

- exportDataToExcel: This method exports a list of Candidates data to an Excel file. It creates a new sheet named "All Candidate's Data" and populates it with candidate information such as ID, name, contact details, addresses, education, skills, etc.

- exportJobPositionToExcel: This method exports a list of JobPosition data to an Excel file. It creates a new sheet named "Job Positions" and populates it with job position information, including the job title, hiring managers, job status, number of candidates, and job requirements.

- exportCandidateFeedbackToExcel: This method exports a list of CandidateFeedback data to an Excel file. It creates a new sheet named "Candidate Feedback" and populates it with candidate feedback information, including feedback ID, candidate name, date of interview, position applied for, interviewer, ratings for different aspects, comments, and the final result.

- exportSampleExcel: This method exports a sample Excel file for candidate data upload. It creates a new sheet named "Sample Excel file for Upload" and populates it with header rows representing the required data fields for uploading candidate information.

The class uses the Apache POI library for working with Excel files. It defines cell styles for header and data cells and sets the appropriate data format for date values. The data is then written to a ByteArrayOutputStream, allowing it to be downloaded or saved to a file. The method is very convenient for generating Excel files containing candidate data, job position data, and candidate feedback data, as well as a sample template for data upload.


### vi. UploadExcelService Class

The UploadExcelService class is responsible for handling the uploading and processing of Excel files containing candidate data. It provides the following methods:

- checkExcelFormat: This static method checks if the uploaded file has the correct format, i.e., an Excel file with the extension .xlsx.

- readExcelFile: This method reads the data from the uploaded Excel file and populates a list of Candidates objects. It uses Apache POI to read the Excel data cell by cell and extract the relevant information for each candidate. The method handles different data types (e.g., strings, integers, dates) and converts them accordingly to populate the Candidates objects.

The class depends on the CandidateRepository and JobPositionRepository for saving the candidate data and fetching job positions, respectively. It saves the extracted candidate data to the database using the candidateRepository.saveAll(candidatesList) method.

Overall, the UploadExcelService class plays a crucial role in the data upload process, ensuring that data from the uploaded Excel file is accurately parsed and stored in the application's database for further processing and analysis.


### vii. EmailSenderService Class
The EmailSenderService class is responsible for sending emails using the JavaMailSender. It provides two methods for sending emails:

- sendEmail: This method is used to send a simple text-based email without any attachments. It takes an EmailSend object as a parameter, which contains the necessary email details such as the receiver's email address, subject, and message body. The method constructs a SimpleMailMessage and sets the email details using the provided values. Then, it sends the email using the mailSender.send(message) method.

- sendEmailWithAttachments: This method is used to send emails with attachments. It takes an EmailSend object and an array of MultipartFile objects as parameters. The EmailSend object contains the email details, while the array of MultipartFile objects contains the attachments that need to be sent with the email. The method creates a MimeMessage and a MimeMessageHelper to handle the attachments. It sets the email details, including the receiver's email address, subject, and message body, using the EmailSend object. Then, it iterates through the array of MultipartFile objects and adds each file as an attachment using the helper.addAttachment method. Finally, the email is sent using the mailSender.send(message) method.

The class uses the JavaMailSender to actually send the emails. The JavaMailSender is autowired into the class, and the sender's email address is obtained from the application properties using the annotation:
```
@Value("${spring.mail.username}") 
```
annotation.

Overall, the EmailSenderService class allows the application to send both simple text-based emails and emails with attachments using the provided JavaMailSender implementation.



## 5. Controller

### i. CandidateController Class
The CandidateController class is a Spring REST Controller responsible for handling HTTP requests related to candidate management. It exposes various endpoints for managing candidates, candidate feedback, and exporting candidate-related data as Excel files. Here are the main functionalities provided by this controller:

#### Candidate Retrieval and Search:
- getAllCandidatesDto: Retrieves a paginated list of all candidates along with their details.
- searchCandidates: Searches candidates based on provided keywords and returns a paginated list.
- getCandidatesByJobId: Retrieves candidates associated with a specific job position.
- getCandidateById: Retrieves a specific candidate by their ID.
- getResumeFileById: Retrieves the resume file of a candidate by their ID.
- getCandidateName: Retrieves the name of a candidate by their ID.
- getCandidatePosition: Retrieves the job position associated with a candidate by their ID.
#### Candidate Filtering:
- searchCandidatesByCurrentCTCAndLocationAndTotalExperience: Filters candidates based on various criteria like current CTC, location, and total experience.

#### Candidate Feedback and Interview Notes:
- addCandidateFeedback: Adds feedback for a specific candidate.
- updateCandidateNote: Updates the interview note for a specific candidate.
- updateCandidateRound: Updates the round of a specific candidate.
- updateCandidateStage: Updates the stage of a specific candidate.

#### Candidate CRUD Operations:
- addCandidate: Creates a new candidate. It accepts an optional PDF file to be attached as a resume.
- updateCandidate: Updates the details of an existing candidate.
- deleteCandidate: Deletes a specific candidate.

#### Candidate Count and Statistics:
- getTotalNumberOfRecords: Retrieves the total count of candidates.
- getNumberOfShortlistedCandidates, getNumberOfHiredCandidates, getNumberOfRejectedCandidates, getNumberOfOnHoldCandidates, and getNumberOfInactiveCandidates: Retrieves the counts of candidates with specific stages.

#### Candidate Excel Export:
- Various endpoints like exportAllCandidatesDataAsExcel, exportJobPositionsToExcel, exportCandidateFeedbackToExcel, and exportSampleExcel allow exporting candidate data and related information as Excel files.

The controller is annotated with @RestController to mark it as a RESTful controller, and it uses various other annotations such as @GetMapping, @PostMapping, @PutMapping, and @DeleteMapping to handle specific HTTP request methods.

This CandidateController class works in conjunction with the CandidateService and JobPositionService, which provide the underlying business logic for handling candidate-related operations. The repository CandidateFeedbackRepository is used to interact with the database for candidate feedback-related operations.

Overall, the CandidateController provides a comprehensive set of endpoints to manage candidates and related data in the application.


### ii. CountryStateCityController Class
The CountryStateCityController class is a Spring REST Controller responsible for handling HTTP requests related to country, state, and city data management. It provides endpoints to add country data from a JSON file and retrieve states and cities associated with a specific country or state. Let's go through the main functionalities provided by this controller:

#### Add Country Data:
- addCountryData: Reads country data from a JSON file and saves it to the database. The JSON file is read using ObjectMapper and converted to a JsonNode, which is then passed to the CountryStateCityService for further processing and database insertion.

#### Retrieve States and Cities:
- getAllStatesForCountry: Retrieves all states associated with a specific country identified by countryId.
- getAllCitiesForState: Retrieves all cities associated with a specific state identified by stateId

The controller is annotated with @RestController to mark it as a RESTful controller, and it uses @RequestMapping to define the base URL path for the endpoints under "/country".

The CountryStateCityController class depends on the CountryStateCityService, which provides the underlying business logic for handling country, state, and city data. The service class is responsible for interacting with the database and processing the data received from the JSON file.

Overall, the CountryStateCityController provides endpoints for adding country data and retrieving states and cities based on country or state identifiers. It plays a crucial role in managing the geographical data of the application.



### iii. JobPositionController Class
The JobPositionController class is a Spring REST Controller responsible for handling HTTP requests related to job positions. It provides endpoints to perform various operations such as adding, updating, and deleting job positions, as well as retrieving job position data. Let's go through the main functionalities provided by this controller:

Get Total Number of Records:

- getTotalNumberOfRecords: Retrieves the total number of job positions in the system.

Get All Jobs:

- getAllJobs: Retrieves a list of job positions with pagination and sorting options.

Get Job by ID:

- getJobById: Retrieves a specific job position by its jobId.

Add Job Position:

- addJobPosition: Adds a new job position to the system. The job description can be provided as an optional PDF file, which is compressed using GZIP before storing it in the database.

Update Job Position:

- updateJobPosition: Updates an existing job position identified by jobId with the data provided in the request body.

Update Candidate Job Status:

- updateCandidateJobStatus: Updates the job status of a candidate associated with a specific job position identified by jobId.

Delete Job Position:

- deleteJobPosition: Deletes a job position identified by jobId.

The controller is annotated with @RestController to mark it as a RESTful controller, and it uses @RequestMapping to define the base URL path for the endpoints under "/jobs".

The JobPositionController class depends on the JobPositionService, which provides the underlying business logic for handling job position data. The service class is responsible for interacting with the database and processing the job position data.

Overall, the JobPositionController provides endpoints for performing CRUD operations on job positions and managing their associated data, including job descriptions in the form of PDF files. It plays a crucial role in managing job positions within the talent management system.



### iv. CandidateFeedbackController Class

The CandidateFeedbackController class is a Spring REST Controller responsible for handling HTTP requests related to candidate feedback. It provides an endpoint to retrieve candidate feedback data based on the candidate's ID. Here are the main functionalities provided by this controller:

Get Candidate Feedback by Candidate ID:
- getCandidateFeedbackByCandidateId: Retrieves a list of candidate feedback objects associated with a specific candidate identified by the candidateId.

The controller is annotated with @RestController to mark it as a RESTful controller, and it uses @RequestMapping to define the base URL path for the endpoints under "/candidates/candidateFeedback".

The CandidateFeedbackController class depends on the CandidateFeedbackService, which provides the underlying business logic for handling candidate feedback data.

Overall, the CandidateFeedbackController provides an endpoint for retrieving candidate feedback data, allowing users to access and view the feedback provided by various interviewers for a specific candidate.


### v. EmailController Class

The EmailController class is a Spring REST Controller responsible for handling HTTP requests related to sending emails. It provides two endpoints for sending emails with or without attachments. These are the main functionalities provided by this controller:

#### Send Simple Email:
- sendSimpleEmail: Accepts an EmailSend object as the request body, which contains the details of the email to be sent, such as the sender's email address, recipient's email address, subject, and message body. It then delegates the task of sending the email to the EmailSenderService using the emailSenderService.sendEmail(details) method. It returns a ResponseEntity with an EmailResponse object indicating that the email has been sent successfully.


#### Send Email with Attachment:
- sendEmail: Accepts an EmailSend object as a @ModelAttribute and an array of MultipartFile objects as a @RequestParam. The EmailSend object contains the email details, and the array of MultipartFile objects contains the attachments to be sent with the email. The endpoint consumes the request with MediaType.MULTIPART_FORM_DATA_VALUE, as it expects file attachments.
- The method then delegates the task of sending the email with attachments to the EmailSenderService using the emailSenderService.sendEmailWithAttachments(email, files) method. It returns a ResponseEntity with an EmailResponse object indicating that the email has been sent successfully.

The controller is annotated with @RestController to mark it as a RESTful controller, and it uses @RequestMapping to define the base URL path for the endpoints under "/email".

The EmailController class depends on the EmailSenderService, which provides the underlying business logic for sending emails.

Overall, the EmailController provides endpoints for sending emails, both simple emails and emails with attachments, allowing users to send messages to recipients with or without files attached. The controller returns appropriate response entities to indicate the status of the email sending process.


### vi. UploadExcelController Class
The UploadExcelController class is a Spring REST Controller responsible for handling HTTP requests related to uploading Excel files containing candidate data. These are the main functionalities provided by this controller:

#### Upload Excel File:
- uploadFile: Accepts a single MultipartFile named "file" as a request parameter. This file contains the Excel data to be uploaded.
- The method first checks if the uploaded file has a valid Excel format using the UploadExcelService.checkExcelFormat(file) method. If the format is invalid (not an Excel file), it returns a ResponseEntity with a bad request status and a message indicating that only Excel files are allowed.
- If the file has a valid Excel format, it calls the uploadExcelService.readExcelFile(file) method to read the data from the Excel file and convert it into a list of Candidates objects.
- The controller then processes the candidatesList as needed. This is where you can implement additional logic to handle the uploaded data, such as saving it to a database or performing any other necessary operations.
- The method constructs a response Map containing a success message and the number of candidates processed. It returns a ResponseEntity with a success status (OK) and the response Map as the body.

The constructor of the controller uses dependency injection to receive an instance of UploadExcelService when creating an instance of the controller.

Overall, the UploadExcelController allows users to upload Excel files containing candidate data. The controller validates the file format, reads the data from the Excel file, and processes it as needed. The controller returns appropriate response entities to indicate the status of the file upload and processing.


## 6. Exceptions
### i. GlobalExceptionHandler Class
The GlobalExceptionHandler class is a Spring @RestControllerAdvice, which means it acts as a global exception handler for all the controllers in the application. It handles specific types of exceptions and provides appropriate responses based on the exception type. Let's go through the exception handling provided by this class:

#### ResourceNotFoundException Handling:

- resourceNotFoundExceptionHandler: This method handles ResourceNotFoundException, a custom exception class that might be thrown when a requested resource is not found.
- The method receives the ResourceNotFoundException object as a parameter and extracts the error message from it.
- It then creates an ApiResponse object with the error message and sets the status to false, indicating that the request was not successful.
- The method returns a ResponseEntity containing the ApiResponse object with the NOT_FOUND status code (HTTP 404).

#### MethodArgumentNotValidException Handling:

- handleMethodArgsNotValidException: This method handles MethodArgumentNotValidException, which is thrown when an argument annotated with @Valid fails validation.
- The method receives the MethodArgumentNotValidException object as a parameter and processes its BindingResult to extract field errors.
- For each field error, the method creates a map entry with the field name as the key and the error message as the value.
- It collects all the field errors in a Map and returns a ResponseEntity containing the Map with the BAD_REQUEST status code (HTTP 400).

In both cases, the exception handler returns appropriate responses in case of exceptions. The controller advice allows these exception handlers to be applied globally to all controllers, ensuring consistent error handling across the application. When an exception of a handled type is thrown within a controller, the corresponding exception handler in this class is triggered, and the appropriate response is returned to the client.

### ii. InvalidRequestException Class

The InvalidRequestException class is a custom exception that extends the RuntimeException class. It is used to represent an exceptional situation where a request is invalid, and it includes a BindingResult object to provide information about the validation errors.

Here's a breakdown of the class:

#### InvalidRequestException:
This is the constructor of the class. It takes two parameters:

- message: A string that represents the error message to be displayed when the exception is thrown.
- bindingResult: A BindingResult object that holds the result of the validation errors.
#### getBindingResult(): 
This is a getter method that returns the BindingResult object associated with the exception. It allows other parts of the application to access the validation errors and handle them accordingly.

The InvalidRequestException class can be thrown when a request is invalid, typically during form submission or input validation. It allows the application to capture and handle validation errors more effectively, providing meaningful error messages to the users when their input fails validation.


### iii. ResourceNotFoundException Class
The ResourceNotFoundException class is a custom exception that extends the RuntimeException class. It is used to represent an exceptional situation where a requested resource is not found in the system.

Here's a breakdown of the class:

#### ResourceNotFoundException: 
This is the constructor of the class. It takes a single parameter:
- message: A string that represents the error message to be displayed when the exception is thrown.

The ResourceNotFoundException class can be thrown when a client makes a request for a specific resource, such as a candidate, job position, or any other entity in the system, but the resource is not found in the database or does not exist. This helps provide meaningful feedback to the client and improves the overall user experience.


## 7. Messages
### i. ApiResponse Class
The ApiResponse class is a simple POJO (Plain Old Java Object) that represents the response format used in the application. It contains two fields: message and success, which are used to convey the result of an API request.

Here's a breakdown of the class:

- message: A string field that holds a message describing the result of the API request. It can be used to provide information or error messages to the client about the outcome of the operation.
- success: A boolean field that indicates whether the API request was successful (true) or not (false). It is used to convey the status of the operation and help the client understand if the request was completed successfully.

The ApiResponse class is a common pattern in many APIs, especially RESTful APIs, where the response needs to be structured and standardized. By encapsulating the result and success status in a single object, it allows for a consistent response format across different API endpoints, making it easier for clients to handle responses in a uniform way.


## 8. Config
It has 3 components

(1) App Config

(2) Security Config

(3) Web Config

**1. App Config**


The provided code is a Spring `@Configuration` class named AppConfig that defines a bean for ModelMapper

- @Configuration: This annotation indicates that the class contains Spring configuration. It tells Spring to process the class and register its beans.

- public ModelMapper modelMapper(): This method is annotated with @Bean, which indicates that it will create and configure a bean of type ModelMapper. The method name, modelMapper, becomes the bean's name.

- return new ModelMapper();: In this method, a new instance of ModelMapper is created and returned. ModelMapper is a library that simplifies the mapping of one object to another (DTO to Entity and vice versa) using conventions and configurations.

By defining the ModelMapper bean in the configuration class, it becomes available for dependency injection in other parts of the application. For example, if any other component or service requires a ModelMapper instance, it can simply declare a dependency on it, and Spring will provide the configured ModelMapper instance through dependency injection.

**2. Security Config**

The provided code is a Spring Security configuration class named `SecurityConfig`. It configures various aspects of security for the application, such as authentication, authorization, password encoding, and security filters.

- @Configuration: This annotation indicates that the class contains Spring configuration.

- @RequiredArgsConstructor: This Lombok annotation generates a constructor with required arguments for the userDetailsService field. It's equivalent to creating a constructor with the @Autowired annotation for the userDetailsService field.

- @EnableWebSecurity: This annotation enables Spring Security's web security features.

- @EnableMethodSecurity: This annotation enables method-level security for the application.

- private final UserDetailsService userDetailsService: This field holds the implementation of Spring Security's UserDetailsService. It is used by the DaoAuthenticationProvider for authentication.

- @Bean protected AuthenticationProvider authProvider(): This method creates a DaoAuthenticationProvider and configures it with the custom UserDetailsService and a PasswordEncoder.

- @Bean public PasswordEncoder passwordEncoder(): This method creates a BCryptPasswordEncoder as the PasswordEncoder. The application will use this encoder to encode and verify passwords.

- @Bean public SecurityFilterChain filterChain(HttpSecurity http): This method configures the security rules for the application using the HttpSecurity object. It defines the rules for URL-based authentication and authorization, CSRF protection, and logout configuration. The H2 database console is allowed to be displayed in an iframe from the same origin (sameOrigin()).

The commented-out section under the authorizeHttpRequests method is an alternative configuration for handling security rules. It restricts access to specific URLs (/candidates/**, /interview/**, /roles/**) to authenticated users while allowing anonymous access to the H2 console (/h2-console/**). The .formLogin() method configures form-based authentication.

The class also contains a commented-out filterChain method that provides another way to configure security rules using a fluent-style approach. This method has similar configuration to the previous filterChain method.

Overall, the SecurityConfig class sets up authentication, authorization, password encoding, and security rules for the Spring Security framework in the application. It ensures that certain URLs are accessible to all users (e.g., H2 console) while others require authentication.


**3. Web Config**

The provided code is a Spring configuration class named WebConfig, which implements the WebMvcConfigurer interface. It configures various aspects of the Spring Web MVC framework, including resource handling, CORS (Cross-Origin Resource Sharing) configuration, and handling SPA (Single Page Application) routing.

- @Configuration: This annotation indicates that the class contains Spring configuration.

- public void addResourceHandlers(ResourceHandlerRegistry registry): This method configures how resources (e.g., static files like CSS, JavaScript, and images) are handled and served by the application.

- The addResourceHandler("/**") method indicates that all resources should be handled by this configuration.
The addResourceLocations("classpath:/static/") method specifies the location of static resources. In this case, it is set to the "static" folder in the classpath.
- The resourceChain(true) method enables the resource chain for resolving resources. The subsequent addResolver method adds a custom PathResourceResolver that helps handle SPA routing. Inside the PathResourceResolver, the getResource method checks if the requested resource exists and is readable. If so, it returns the requested resource. If the requested resource doesn't exist or is not readable, it returns the index.html file from the "static" folder. This is useful for handling client-side routing in SPA applications, where all requests should be redirected to the main index.html file so that the client-side application can handle the routing.

The commented-out section under the addCorsMappings method is an alternative configuration for handling CORS. It allows requests from "http://localhost:4200" (e.g., for Angular applications) and specifies the allowed HTTP methods (GET, POST, PUT, DELETE, OPTIONS). Additionally, it allows credentials to be included in CORS requests (allowCredentials(true)).

CORS is a security feature implemented by web browsers that restricts webpages from making requests to a different domain than the one that served the web page. The addCorsMappings method allows the server to specify which origins are allowed to access its resources.

Overall, the WebConfig class sets up resource handling and CORS configuration for the Spring Web MVC framework in the application. It ensures that static resources are served from the "static" folder and that client-side routing in SPA applications is correctly handled. Additionally, it allows cross-origin requests from "http://localhost:4200" and specifies allowed HTTP methods and credentials for CORS requests.








---

## Spring Resources
### 1. Application YML
It is a configuration file is for a Spring Boot application, specifically for the "Talent Management System" (TMS).
The important configurations present in this file are:

Server Configuration:

- server.port: 8181: Specifies that the application should run on port 8181.

Spring Configuration:

- spring.main.log-startup-info: false: Disables the startup info logging by Spring Boot.
- spring.main.banner-mode: off: Turns off the banner display on application startup.

Application Configuration:

- spring.application.name: Talent Management System: Sets the application name to "Talent Management System".
Security Configuration:

- spring.security.user: Configures a default user for basic authentication. The application will have a default username and password of "admin" for accessing secured endpoints.

Email Configuration:

- The email configuration is commented out, and two options are provided: Tecunique Configurations and Gmail Configurations.
- The Gmail Configurations are active, enabling the application to send emails using Gmail SMTP.
- The SMTP host is set to smtp.gmail.com, and the username and password are provided for authentication.

Database Configuration:

- The application is using an H2 in-memory database.
- The database URL is configured to use H2 with the data stored in a file under the location specified by `${tms.home}/data/tms-h2db`.

H2 Console Configuration:

- The H2 Console is enabled (console.enabled: true), allowing access to the H2 database console from the application.
- The console path is set to /h2-console, meaning it can be accessed at `http://localhost:8181/h2-console`
- Other H2 Console settings are also provided, such as trace and web-allow-others.

JPA (Java Persistence API) / Hibernate Configuration:

- hibernate.ddl-auto: update: Specifies that Hibernate should automatically create and update the database schema based on the entity classes.
- hibernate.dialect: org.hibernate.dialect.H2Dialect: Sets the Hibernate dialect for H2.
- show-sql: true: Enables the display of SQL statements in the application logs.
- open-in-view: false: Disables the "Open EntityManager in View" pattern.

Custom Property:

- tms.home: `~/tms-home`: Defines a custom property tms.home and sets its value to the home directory (`~/tms-home`). This property can be used in other parts of the configuration.

Overall, this configuration file sets up various aspects of the TMS application, including the server port, database settings, email configuration, security, and H2 Console access.


### 2. log4j2 XML

The provided XML configuration is for logging using Apache Log4j2. The important elements and settings in this configuration are:

Configuration: The root element for the Log4j configuration.

Appenders: This section defines the appenders used to output logs.

- Console: An appender that outputs logs to the system console (STDOUT).
- RollingFile: A rolling file appender that outputs logs to a file. It rolls over log files based on certain policies (size, time, etc.).
PatternLayout: This element defines the log message format using a pattern. It includes the date, log level, thread name, class, and log message.

Policies: This section contains the triggering policies for log rollover.

- OnStartupTriggeringPolicy: A triggering policy that rolls over the log file on application startup.
- SizeBasedTriggeringPolicy: A triggering policy that rolls over the log file when it reaches a certain size (20 MB in this case).
- CronTriggeringPolicy: A triggering policy that rolls over the log file daily at midnight (0 0 0 * * ?).

Loggers: This section configures the loggers and their levels.

- Two loggers are configured with different names and levels: "org.springframework" and "org.apache". They are set to log at the "warn" level.
- The additivity="false" attribute indicates that logs should not propagate to parent loggers.
- The root logger is configured to log at the "info" level, and it includes both the Console and MyFile appenders.

Custom Property:

- `${tms.home}`: Defines a custom property that can be used in the file paths. The actual value for this property should be provided elsewhere in the application configuration.

Overall, this configuration sets up logging for the TMS application. Logs will be displayed on the console and written to a rolling log file with a maximum size of 20 MB. The logs are formatted to include the timestamp, log level, thread name, class, and log message. The log levels for the "org.springframework" and "org.apache" packages are set to "warn", while the root logger is set to "info".

---
## Spring Boot Test

Run all the tests in Spring Boot with Junit 5




---
## Maven POM file

The provided file is a Maven POM (Project Object Model) file, used for managing dependencies and build configurations for a Java project. It contains information about the project and its dependencies.

Here's a breakdown of the key elements in the POM file:

1. `<project>`: The root element that encloses all other elements in the POM file.

2. `<modelVersion>4.0.0</modelVersion>`: Specifies the version of the POM model used. In this case, it is version 4.0.0, which is the standard for Maven POM files.

3. `<parent>`: This section declares the parent project, which means the current project inherits properties and dependencies from the parent. The parent project is defined with the following details:

   - `<groupId>`: The Maven Group ID of the parent project.
   - `<artifactId>`: The Maven Artifact ID of the parent project.
   - `<version>`: The version of the parent project to be used.

4. `<artifactId>talent-management-system</artifactId>`: Specifies the Artifact ID of the current project. The Artifact ID is a unique identifier for the project.

5. `<name>Talent Management System: Webapp</name>`: Specifies the name of the project.

6. `<dependencyManagement>`: This section is used to declare and manage dependencies for the project. It does not actually include the dependencies in the project but allows you to define versions and scopes of dependencies that will be used in the child modules of the project.

7. `<dependencies>`: This section lists the project's dependencies, which are external libraries that the project requires. Each `<dependency>` element contains details about a specific dependency, including:

   - `<groupId>`: The Maven Group ID of the dependency.
   - `<artifactId>`: The Maven Artifact ID of the dependency.
   - `<version>`: The version of the dependency to be used.
   - `<scope>`: The scope of the dependency, such as "runtime" or "test," which determines when the dependency is available during the build process.

8. `<build>`: This section contains build-related configurations and plugins.

   - `<plugins>`: Lists the plugins used in the project. In this case, it includes the Spring Boot Maven Plugin.

   - `<configuration>`: This section is specific to the Spring Boot Maven Plugin and allows for custom configuration of the plugin. In this case, it excludes the `lombok` dependency from being packaged in the final build. It's common to exclude Lombok since it is typically used for development-time convenience and doesn't need to be included in the final packaged JAR.

Overall, this POM file defines the project's dependencies, including various Spring Boot starters, database libraries, testing libraries, and others, and sets up the Spring Boot Maven Plugin for building the project. The version numbers for the dependencies are specified to ensure compatibility with the project's parent and other dependencies. The `talent-management-system` project is a web application, and the POM file configures it accordingly.

---
# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.



# **Project content**

# Modules

There are following features (modules) of the app:

(1) `Dashboard`

(2) `Candidate registration`

(3) `Interview feature`

(4) `Report` 

## Dashboard

The dashboad feature comprises of three components:

(1) `Dashboard main component`

(2) `Stat cards`

(3) `Dashboard job status` 

Explained as below: 

**DashboardMainComponent Documentation**

**1. Component Description:**
The `DashboardMainComponent` is an Angular component that represents the main dashboard page. It displays various statistics and charts related to candidates and job positions. The component fetches data from the backend using `CandidateService` and `JobService`, then displays the data in cards and a doughnut chart.

**2. Properties:**

- `pieChartCanvas`: A reference to the canvas element used to render the pie chart.
- `pieChart`: The Chart.js instance representing the doughnut chart.
- `pieChartData`: An array containing the counts of candidates in different categories (hired, on-hold, rejected, inactive).
- `pieChartLabels`: An array of labels for the doughnut chart segments.
- `cardData`: An array of objects representing the data to be displayed in the stat cards.

**3. Dependencies:**
The component uses Chart.js library to create the doughnut chart. It also depends on `CandidateService` and `JobService` to fetch data from the backend.

**4. Lifecycle Hooks:**

- `ngOnInit()`: This lifecycle hook is executed when the component is initialized. It calls the `fetchAllData()` method to fetch data from the backend and initialize the pie chart.
- `ngAfterViewInit()`: This lifecycle hook is executed after the view is initialized. It is currently empty as there is no specific action required after the view is initialized.

**5. Methods:**

- `fetchAllData()`: This method fetches data related to candidates and job positions from the backend using `forkJoin` to make parallel API calls. After receiving the data, it updates the `cardData` array and calls `createPieChart()` to initialize the pie chart.
- `updateChart()`: This method updates the data of the pie chart and triggers an update to reflect the changes on the chart canvas.
- `createPieChart()`: This method creates a new Chart.js instance for the doughnut chart, based on the data in `pieChartData`, and initializes the chart on the canvas referenced by `pieChartCanvas`.
- `getTotalNumberOfCandidates()`: This method fetches the total number of candidates from the backend using the `CandidateService` and updates the corresponding count in the `cardData` array.
- Other methods (currently commented out): These methods fetch data for different categories of candidates (e.g., shortlisted, hired, on-hold) and update the corresponding counts in the `cardData` array. Currently, they are commented out as they are not being used in the current implementation.

**6. Template:**
The component's template (`dashboard-main.component.html`) contains the HTML structure for displaying the stat cards and the doughnut chart. It uses `*ngFor` to loop through the `cardData` array and renders individual `app-stat-cards` components for each data object. The doughnut chart is rendered using the `canvas` element with a reference to `#pieChartCanvas`.

**7. Styles:**
The component's styles (`dashboard-main.component.css`) define the layout and appearance of the dashboard elements. Styling includes card containers, chart containers, and colors for the doughnut chart segments.

**8. Additional Notes:**
- The component uses `forkJoin` to make parallel API calls to fetch multiple data points simultaneously, improving the loading performance of the dashboard.
- The `CardData` array contains objects representing different categories of data to be displayed on the stat cards. Each object contains a `key` to identify the data, a `title` for the card, and a `count` representing the number of items in that category.
- The doughnut chart represents the distribution of candidates in different categories. The counts are extracted from the `cardData` array and assigned to `pieChartData`.
- The doughnut chart uses Chart.js library, and its instance is created in the `createPieChart()` method.
- The component fetches data from the backend using `CandidateService` and `JobService`, which are injected into the component's constructor using dependency injection.

Overall, the `DashboardMainComponent` is responsible for fetching and displaying statistical data related to candidates and job positions in the form of stat cards and a doughnut chart. The chart represents the distribution of candidates in different categories, and the stat cards show various statistics related to the candidates and jobs.

**DashboardJobStatusComponent Documentation**

**1. Component Description:**
The `DashboardJobStatusComponent` is an Angular component responsible for displaying candidate data based on their job status. It fetches and displays a list of candidates associated with a specific job status, allowing users to view and manage candidate details efficiently. The component leverages Angular Material components, animations, and various services to create an interactive dashboard with sorting, pagination, and actions on each candidate.

**2. Dependencies:**
The component imports various Angular Material modules for UI components such as `MatPaginator`, `MatSort`, `MatDialog`, `MatSnackBar`, etc. It also imports several custom components (`EditCandidateFormComponent`, `EmailFormComponent`, `InterviewerNoteComponent`) for handling different interactions related to candidate management. Additionally, it relies on services like `CandidateService` and `CandidateDataService` for fetching and managing candidate data.

**3. Template Structure:**
The component's template (`dashboard-job-status.component.html`) consists of the following elements:

- **Table:** The main section of the template is the table section, represented by `mat-table`. It displays candidate data in rows and columns, and each column corresponds to a specific attribute of the candidate.
  - The `matColumnDef` directives define the columns of the table, such as "ID," "Name," "Received," "Source," "Stage," "Feedback," "Action," and "Round."
  - The `@ViewChild` decorators (`MatPaginator` and `MatSort`) allow access to the pagination and sorting features for the table.
  - The `*matHeaderRowDef` and `*matRowDef` directives define the header and row content for the table, respectively.
  - The `trigger` for animation handles the row expansion when a user clicks on the expand button.
- **Progress Bar:** A Material progress bar (`mat-progress-bar`) displayed when data is being loaded (`isLoading` is true). It provides a visual indication of the ongoing data retrieval process.
- **Paginator:** The `mat-paginator` is used to provide pagination functionality for the candidate list, enabling users to navigate through the data pages efficiently.

**4. Component Properties:**

- `key`: A number representing the job status key used to fetch candidate data based on the status.
- `candidates`: An array of `CandidateResponse` objects that holds the candidate data fetched from the server.
- `dataSourceExists`: A boolean property indicating whether there is data available in the `dataSource` (`true`) or not (`false`).
- `length`: The total number of candidates available for the specified job status, used for pagination.
- `pageIndex`: The current page index of the paginator.
- `pageSize`: The number of items displayed per page in the paginator.
- `isLoading`: A boolean property indicating whether data is being loaded (`true`) or not (`false`).
- `rounds`: An array of numbers representing different rounds available for the candidates.
- `stages`: An array of strings representing the different stages that a candidate can be in.
- `dataSource`: The data source for the table, representing the candidate list to be displayed.
- `columnsToDisplay`: An array of strings representing the columns to be displayed in the table.
- `columnsToDisplayWithExpand`: An array of strings representing the columns to be displayed in the expanded table rows, including the additional "expand" column.
- `expandedElement`: A `CandidateResponse` object representing the currently expanded row in the table.

**5. Methods:**

- `ngOnInit()`: Lifecycle hook that is executed after the component's content has been initialized. It fetches the `key` parameter from the route and initializes the component by setting up the pagination and loading the candidate data.
- `setLength()`: A method that fetches the total number of candidates for the specified job status (`key`) and sets the `length` property for pagination.
- `announceSortChange(sortState: Sort)`: A method that announces the sorting change using the `LiveAnnouncer` service when the user clicks on a sortable column header to sort the table.
- `fetchResumeById(id: number)`: A method that fetches the resume file of a candidate with the specified ID and opens the resume in a new tab or downloads it based on the file type.
- `fetchCandidatesWithStage(columnName: string, sortDirection: string)`: A method that fetches the candidate data based on the selected sorting criteria (`columnName` and `sortDirection`). It is called when sorting or when navigating to a different page using the paginator.
- `openFeedbackForm(candidateId: number)`, `editCandidate(element: Candidate)`, `showComments(candidateId: number)`, `addNote(element: Candidate)`, `sendEmail(element: Candidate)`: These methods handle various interactions with the candidates, such as opening a feedback form, editing candidate details, showing interview feedback, adding notes, or sending emails.
- `onPageChange(event: PageEvent)`: A method that is called when the user changes the page using the paginator. It updates the `pageIndex` and `pageSize` and fetches the corresponding candidates based on the selected page.
- `routeBack()`: A method that navigates the user back to the dashboard.

**6. Animations:**

- The `detailExpand` trigger animates the row expansion when the user clicks on the expand button. It sets the height of the expanded row to '*' to make it expand smoothly.

**7. Initialization:**
The component initializes by fetching the `key` parameter from the route and setting up the pagination. It also subscribes to changes in the `dataSource` from the `CandidateDataService`, allowing it to update the table data when necessary.

**8. Additional Notes:**

- The component uses various service methods from `CandidateService` to fetch candidate data based on the selected job status and sort criteria.
- The component uses different custom dialogs (`EditCandidateFormComponent`, `EmailFormComponent`, `InterviewerNoteComponent`) to handle various interactions related to candidate management.
- The candidate data is displayed in a table with pagination and sorting functionality, allowing users to navigate and organize the candidate list efficiently.
- When a user clicks on the "expand" button in a row, the row expands to show additional details of the candidate (`expandedDetail`).
- The component uses a `dataSourceExists` property to handle scenarios when there is no candidate data to display, showing a message indicating "No data found" when applicable.
- The `isLoading` property is used to display a progress bar when data is being loaded.
- The `LiveAnnouncer` service is used to announce changes when sorting the table, providing better accessibility for users.
- The component provides various methods for updating candidate details, including updating stages, rounds, and other actions.
- The `DashboardJobStatusComponent` contributes to an interactive and feature-rich dashboard for managing candidates based on their job status, enhancing the overall user experience.

**StatCardsComponent Documentation**

**1. Component Description:**
The `StatCardsComponent` is an Angular component responsible for displaying statistical cards on the dashboard. Each card represents specific statistical data related to candidates or job statuses. The component receives data through the `@Input()` decorator, allowing it to display the appropriate information for each card dynamically. When a user clicks on a statistical card, it navigates to a specific page based on the `key` value associated with the card data.

**2. Dependencies:**
The component imports Angular modules for `@Input`, `OnInit`, and `Router`, as well as the `MatSnackBar` module for displaying snack bars to notify users of certain events.

**3. Template Structure:**
The `StatCardsComponent` does not have an HTML template (`stat-cards.component.html`) as it does not require any complex UI structure. Instead, it directly uses the `@Input` data to display the statistical card information.

**4. Component Properties:**

- `data`: An `@Input()` property representing the statistical data for a specific card. It includes three properties:
  - `key`: A number representing the card type or identifier. It is used to determine the action to be performed when the card is clicked.
  - `title`: A string representing the title or label displayed on the card.
  - `count`: A number representing the statistical count or value to be displayed on the card.

- `role`: A boolean property (not used in the provided code snippet).

**5. Methods:**

- `ngOnInit()`: Lifecycle hook that is executed after the component's content has been initialized. It does not have any specific logic in the current implementation.

- `openComponent()`: A method that is called when a user clicks on a statistical card. It uses the `data.key` value to navigate the user to a specific page based on the card type.

**6. Initialization:**
The component does not require any specific initialization in the provided code snippet, as it only handles the navigation to different pages when a card is clicked.

**7. Additional Notes:**

- The `StatCardsComponent` is designed to display various statistical cards on the dashboard, providing an overview of essential data related to candidates and job statuses.
- The component dynamically updates the card information based on the data passed through the `@Input()` property.
- The `openComponent()` method uses the `Router` to navigate the user to different pages based on the `data.key` value.
- Each card has a specific `key` value associated with it, which determines the destination page when the user clicks on the card.
- The `MatSnackBar` service could be used to display snack bars for notifying users of specific events related to the statistical data or navigation actions. However, it is not utilized in the current implementation.

## Candidate registration

There are four components in this module:

(1) Candidate registration form

(2) Skills form

(3) Search candidates form
    
    (a) Edit canididate form

**CandidateRegistrationFormComponent Documentation**

**1. Component Description:**
The `CandidateRegistrationFormComponent` is an Angular component responsible for displaying and handling the candidate registration form. The form allows users to input various details about the candidate, such as personal information, education, employment history, and more. The component includes form validation, auto-complete for state and city selection, and integration with dialog components to handle employment, education, and link details.

**2. Dependencies:**
The component imports Angular modules for `FormBuilder`, `MatDialog`, `Router`, and `MatSnackBar` for form handling, dialog functionality, navigation, and displaying snack bars.

**3. Form Controls:**
The `CandidateRegistrationFormComponent` defines several form controls using `FormBuilder`, which include:

- `firstName`: For the candidate's first name (Validators: required, pattern).
- `lastName`: For the candidate's last name (Validators: required, pattern).
- `email`: For the candidate's email address (Validators: required, pattern).
- `mobilePhone`: For the candidate's mobile phone number (Validators: required, pattern).
- `highestDegree`: For the candidate's highest educational degree (Validators: required).
- `specialization`: For the candidate's educational specialization.
- `yearOfAchievement`: For the candidate's year of educational achievement.
- `source`: For the source from where the candidate heard about the job opening (Validators: required).
- `note`: For any additional notes or comments about the candidate.
- `referral`: For the candidate referral details, including first name and last name (Validators: pattern).

**4. Autocomplete and Filtering:**
The component uses `MatAutocomplete` and `Observable` to provide auto-complete functionality for state and city selection. It uses filtering functions to display matching state and city options based on user input.

**5. SubForm Validation:**
The component includes methods to validate sub-forms, such as the education details. If any of the sub-form fields are invalid, the form submission is prevented.

**6. Dialog Integration:**
The component integrates with several dialog components (`EmploymentComponent`, `LinksComponent`, and `EducationComponent`) to allow users to add employment history, links, and education details, respectively. The dialog components receive and update form data and communicate back to the parent component.

**7. Form Submission and Navigation:**
When the user clicks the "Submit" button, the form is validated using the `checkFormValidation()` method. If the form is valid, the form data is stored in `sessionStorage`, and the user is navigated to the "more-details" page for further candidate information.

**8. Initialization:**
In the `ngOnInit()` method, the component sets up the filtered options for auto-complete fields (`filteredStates`, `filteredCities`, `filteredPermanentStates`, `filteredPermanentCities`, `filteredDegrees`, `filteredSpecializations`). These filtered options update based on user input to show matching state and city names.

**9. Additional Notes:**
- The `CandidateRegistrationFormComponent` is part of the candidate registration process and is used to collect essential candidate information.
- The component's form includes various validations to ensure that the data entered by the user is in the correct format.
- Dialog components are used for specific details (employment, links, and education) to provide a user-friendly interface for adding the respective information.
- The `MatSnackBar` service is used to display error messages for invalid form fields to guide users during form completion.
- The component is designed to facilitate seamless navigation between form sections, ensuring that users can enter and review candidate details efficiently.

**Skills form component**

**1. Constructor:**
- Initializes the component and injects required services and dependencies.
- Sets up form controls, filter observables, and default values for the skills form.
- Initializes the `moreDetails` FormGroup using `formBuilder`.

**2. ngOnInit:**
- Lifecycle hook called after the component has been initialized.
- Calls `getJobCount()` to fetch the total job count.

**3. getJobCount:**
- Fetches the total count of available jobs using the `jobService.getTotalJobCount()` method.
- Calls `getJobPositions()` to fetch the job positions with the obtained count.

**4. getJobPositions:**
- Fetches job positions using the `jobService.getJobs(jobCount)` method.
- Assigns the response (job positions) to the `positions` array.

**5. checkFormValidation:**
- Validates the form for any invalid fields.
- If any field is invalid, it marks the corresponding controls as "touched" to show validation errors.
- Displays a snackbar message listing the invalid fields.
- Returns `true` if the form is valid, else returns `false`.

**6. onSubmit:**
- Checks form validation using the `checkFormValidation()` method.
- If the form is valid, it disables the submit button to prevent multiple submissions.
- Calls `candidateService.addCandidate(this.moreDetails.value)` to submit the form data.
- On successful submission, it sets `submitted` to `true`, shows a snackbar message, and navigates back to the home page.
- If there is an error during submission, it displays an appropriate snackbar message.

**7. openSnackBar:**
- Utility function to display a snackbar with the given message and action.

**8. closeAlert:**
- Clears the `submitted` flag, which controls the display of the success alert.

**9. addSkill:**
- Handles the addition of skills to the `skills` array.
- Trims the input value, converts to lowercase, and adds the skill if it does not already exist (case-insensitive) in the `skills` array.
- Displays a snackbar message if the skill is already added.

**10. addMoreSkill:**
- Handles the addition of skills to the `moreSkills` array (similar to `addSkill`).

**11. removeSkill:**
- Removes the specified skill from the `skills` array.

**12. removeMoreSkill:**
- Removes the specified skill from the `moreSkills` array.

**13. selectedSkill:**
- Handles the selection of a skill from the autocomplete list.
- Adds the selected skill to the `skills` array if it does not already exist (case-insensitive).

**14. selectedMoreSkill:**
- Handles the selection of a skill from the autocomplete list (similar to `selectedSkill`).

**15. _filter:**
- Private helper function used by the autocomplete filter.
- Filters the list of skills based on the input value.

**16. get totalExperience:**
- Getter method for the total experience form control.

**17. get currentCTC:**
- Getter method for the current CTC form control.

**18. get expectedCTC:**
- Getter method for the expected CTC form control.

**19. get currentNoticePeriod:**
- Getter method for the current notice period form control.

**20. get workMode:**
- Getter method for the work mode form control.

**21. get job_id:**
- Getter method for the job ID form control.

**22. get communicationSkills:**
- Getter method for the communication skills form control.

The component also contains properties for various form controls, arrays to store skills and job positions, and configuration for the slider (max, min, showTicks, step, thumbLabel, value).

**Search candidate component**

**1. Constructor:**
- Initializes the component and injects required services and dependencies.
- Initializes variables related to selection, filtering, and pagination.
- Sets up the initial state for columns and sorting.
- Calls the `fetchCandidates()` method to fetch candidate data.

**2. ngOnInit:**
- Lifecycle hook called after the component has been initialized.
- Subscribes to the `candidateDataService.dataSourceChanges` observable to update the `dataSource` with new candidate data.
- Fetches the candidates if there are no query parameters present in the URL.
- Calls the `getTotalNumberOfRecords()` method of `candidateService` to get the total number of candidate records.

**3. fetchCandidates:**
- Fetches candidate data from the server using the `candidateService.getCandidates()` method.
- Initializes the `dataSource` with the fetched candidate data.
- Handles error cases and displays snackbar messages accordingly.

**4. onPageChange:**
- Handles pagination events when the page size or index changes.
- Updates the `pageIndex` and `pageSize` variables based on the event.
- Fetches candidates with the updated pagination settings.
- If there are URL keywords or filters, it fetches candidates based on the search criteria.
- Updates the `dataSource` and `length` accordingly.

**5. isAllSelected:**
- Checks if all rows are selected by comparing the number of selected rows to the total number of rows.

**6. toggleAllRows:**
- Toggles selection for all rows based on the current selection state.

**7. checkboxLabel:**
- Generates the label for the checkbox used in the header row or each candidate row.

**8. fetchResumeById:**
- Fetches the resume file for a candidate by their ID using the `candidateService.getResumeFileById()` method.
- Opens the resume file in a new tab or downloads it based on the file type (PDF or others).

**9. openDeleteConfirmationDialog:**
- Opens a dialog component (`DeleteConfirmationComponent`) to confirm the deletion of selected candidates.
- Passes the IDs of the selected candidates to the dialog for further processing.

**10. announceSortChange:**
- Announces the sort change using `LiveAnnouncer`.
- Fetches candidates with the updated sort settings and updates the `dataSource`.

**11. rowNotSelected:**
- Checks if any row is selected or not and handles related display conditions.

**12. editCandidate:**
- Opens a dialog (`EditCandidateAllFormComponent`) to edit the data of a specific candidate.
- Passes the candidate data to the dialog.

**13. updateCandidate:**
- Updates the data of a candidate using the `candidateService.updateCandidate()` method.
- Fetches candidates again after successful update.
- Handles error cases and displays snackbar messages accordingly.

**14. deleteCandidates:**
- Deletes selected candidates using the `candidateService.deleteCandidate()` method.
- Updates the `dataSource` and total number of records after successful deletion.
- Handles error cases and displays snackbar messages accordingly.

The component also contains various properties related to candidate data, pagination, sorting, selection, form controls, and filtering. It uses Angular Material components for displaying and interacting with the data (such as MatPaginator, MatSort, MatDialog, MatSnackBar). Additionally, there are properties for handling UI states like `isLoading`, `isDeleted`, `isDeleteClicked`, etc.

## Report module

Report module is responsible for operations with excel file. I can import candidates from excel file, download sample excel file and download various data in form of excel file.

It has following component: 

(1) Report Main component

**Report Main component**

1. `exportAllCandidatesData()`:
   - This function is called when the user clicks the button to export all candidates' data.
   - It calls the `exportAllCandidatesData()` method from the `ExportToExcelService` service to fetch the data from the server in the form of a BlobPart.
   - Once the data is received, it creates a Blob with the response data and generates a URL for the Blob.
   - A temporary anchor element (`<a>`) is created, and its `href` attribute is set to the generated URL, and `download` attribute is set to the desired file name.
   - The anchor element is then programmatically clicked to trigger the file download.
   - The downloadingFile.allCandidate property is set to `true` while the download is in progress and is set back to `false` once the download is complete or an error occurs.

2. `exportJobPositionsData()`:
   - This function is called when the user clicks the button to export job positions' data.
   - It calls the `exportJobPositionsData()` method from the `ExportToExcelService` service to fetch the data from the server in the form of a BlobPart.
   - The response BlobPart is processed similarly to the `exportAllCandidatesData()` function to trigger the file download.

3. `exportCandidateFeedbackData()`:
   - This function is called when the user clicks the button to export candidate feedback data.
   - It calls the `exportCandidateFeedbackData()` method from the `ExportToExcelService` service to fetch the data from the server in the form of a BlobPart.
   - The response BlobPart is processed similarly to the previous functions to trigger the file download.

4. `exportSampleExcelFile()`:
   - This function is called when the user clicks the button to export a sample Excel file.
   - It calls the `exportSampleExcelFile()` method from the `ExportToExcelService` service to fetch the sample data from the server in the form of a BlobPart.
   - The response BlobPart is processed similarly to the previous functions to trigger the file download.

5. `onFileSelected(event: any)`:
   - This function is called when the user selects a file using the file input element.
   - It updates the `selectedFile` property with the selected file and displays the file name on the page.

6. `resetFileInput()`:
   - This function is used to reset the file input element after the file has been uploaded.
   - It clears the value of the file input element so that the same file can be selected again if needed.

7. `uploadFile()`:
   - This function is called when the user clicks the button to upload a file to the server.
   - It checks if a file is selected and whether the file is currently being uploaded (`uploadingFile` property).
   - If the file is not selected or if the previous upload is in progress, appropriate messages are displayed using MatSnackBar.
   - If the file is selected and not being uploaded, the `uploadFile()` method from the `ExportToExcelService` service is called to upload the file.
   - Upon successful upload, a success message is displayed using MatSnackBar, and the selected file is cleared (`selectedFile` set to null) and the file input is reset.
   - If an error occurs during the upload, the appropriate error message is displayed using MatSnackBar, and the `uploadingFile` property is set back to `false`.

Note: The code assumes the existence of the `ExportToExcelService` service that provides methods to interact with the server for exporting and importing data to/from Excel files.

Apart from all these components, the app includes various services to communicate with the backend.


# Services

Following are the services that are implemented in the app:

(1) `CandidateService`: This service is reponsible for all the request handling with the `Candidate Controller`. The use of this service is to fetch the candidate data from the backend.

(2) `EmailService`: This service is responsible for communicationg with the `EmailController` in the backend. It is used for sending emails to the candidates

(3) `JobService`: This service is reponsible for communication with the `JobPositionController` in the backend. The use of this service is to fetch job positions' data from the backend.

(4) `ExportToExcelService`: This service is responsible for exporting the data from backend as excel file.

**CandidateService**

Let's go through each function of the `CandidateService` in detail:

1. `getTotalNumberOfRecords()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count` to get the total number of candidate records.
   - It returns an `Observable<number>` that will emit the total number of records received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

2. `getResumeFileById(id: number)`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/resume/${id}` to get the resume file of a specific candidate identified by the given `id`.
   - The response from the server is expected to be a Blob (binary data) representing the resume file.
   - The `responseType: 'blob'` option is set in the request to inform the server that a binary response is expected.
   - It returns an `Observable<Blob>` that will emit the Blob data received from the server.

3. `getNumberOfShortlistedCandidates()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count/shortlisted` to get the number of shortlisted candidates.
   - It returns an `Observable<number>` that will emit the number of shortlisted candidates received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

4. `getNumberOfHiredCandidates()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count/hired` to get the number of hired candidates.
   - It returns an `Observable<number>` that will emit the number of hired candidates received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

5. `getNumberOfRejectedCandidates()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count/rejected` to get the number of rejected candidates.
   - It returns an `Observable<number>` that will emit the number of rejected candidates received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

6. `getNumberOfOnHoldCandidates()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count/on-hold` to get the number of candidates on hold.
   - It returns an `Observable<number>` that will emit the number of candidates on hold received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

7. `getNumberOfInactiveCandidates()`:
   - This function sends an HTTP GET request to the server endpoint `/candidates/count/inactive` to get the number of inactive candidates.
   - It returns an `Observable<number>` that will emit the number of inactive candidates received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which logs the error message and returns a default value of `0`.

8. `handleError<T>(operation = 'operation', result?: T)`:
   - This is a private helper function used to handle errors in HTTP requests.
   - It takes the `operation` name and an optional `result` value that will be returned as a default value in case of an error.
   - When an error occurs, it logs the error message to the console and returns the `result` value casted to the generic type `T`.
   - This function is used as a `catchError` operator in the other functions to handle errors gracefully.

9. `getCandidates(pageNumber: number, pageSize: number, sortField: string = 'asc', sortOrder: string)`:
   - This function sends an HTTP GET request to the server endpoint `/candidates` with query parameters for pagination and sorting.
   - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.
   - If an error occurs during the HTTP request, it will be caught and handled by the `handleError` function, which returns an empty array as a default value.

10. `getCandidateById(candidateId: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/${candidateId}` to get a specific candidate's details.
    - It returns an `Observable<Candidate>` that will emit the candidate object received from the server.

11. `addCandidate(candidate: Candidate)`:
    - This function sends an HTTP POST request to the server endpoint `/candidates/` to add a new candidate.
    - It takes the `candidate` object as the request body and returns an `Observable<Candidate>` that will emit the candidate object received from the server.

12. `updateCandidate(candidate: Candidate, candidateId: number)`:
    - This function sends an HTTP PUT request to the server endpoint `/candidates/${candidateId}` to update an existing candidate's details.
    - It takes the `candidate` object as the request body and the `candidateId` to identify the candidate to be updated.
    - It returns an `Observable<Candidate>` that will emit the updated candidate object received from the server.

13. `deleteCandidate(candidateId: number)`:
    - This function sends an HTTP DELETE request to the server endpoint `/candidates/${candidateId}` to delete a candidate with the given `candidateId`.
    - It returns an `Observable<void>` with no data to be emitted upon successful deletion.

14. `addInterviewerNote(note: string, candidateId: number)`:
    - This function sends an HTTP PUT request to the server endpoint `/candidates/${candidateId}/note` to add a note to a candidate's record.
    - It takes the `note` text as the request body and the `candidateId` to identify the candidate.
    - If an error occurs during the HTTP request, it will be caught and rethrown to be handled by the caller.

15. `getCandidatesByJobPosition(jobId: number, pageNumber: number, pageSize: number, sortField: string = 'asc', sortOrder: string)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/job/${jobId}` with query parameters for pagination and sorting to get candidates filtered by job position.
    - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.

16. `getCandidateByJobAndKeywords(jobId: number, keywords: string[], pageIndex: number, pageSize: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/search/${jobId}` with query parameters for filtering candidates by job and keywords.
    - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.

17. `getCandidateByJobAndFilters(jobId: number, params

: URLSearchParams, pageIndex?: number, pageSize?: number, sortField?: string, sortDirection?: string)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/${jobId}/filter` with query parameters and filters to get candidates by job and custom filters.
    - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.

18. `getCandidateName(candidateId: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/name/${candidateId}` to get the name of a candidate with the given `candidateId`.
    - It returns an `Observable<string>` that will emit the candidate's name received from the server.

19. `getCandidatePosition(candidateId: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/position/${candidateId}` to get the position of a candidate with the given `candidateId`.
    - It returns an `Observable<number>` that will emit the candidate's position received from the server.

20. `addCandidateFeedback(candidateId: number, feedback: CandidateFeedback)`:
    - This function sends an HTTP POST request to the server endpoint `/candidates/${candidateId}/feedback/add` to add feedback for a candidate.
    - It takes the `feedback` object as the request body and the `candidateId` to identify the candidate for which the feedback is added.
    - It returns an `Observable<CandidateFeedback>` that will emit the added feedback object received from the server.

21. `getCandidateFeedback(candidateId: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/candidateFeedback/${candidateId}` to get the feedback for a candidate.
    - It returns an `Observable<CandidateFeedback[]>` that will emit an array of `CandidateFeedback` objects representing the feedback received from the server.

22. `updateCandidateRound(candidateId: number, round: number)`:
    - This function sends an HTTP PUT request to the server endpoint `/candidates/${candidateId}/round` to update the round number of a candidate's interview process.
    - It takes the `round` number as the request body and the `candidateId` to identify the candidate to be updated.
    - If an error occurs during the HTTP request, it will be caught and rethrown to be handled by the caller.

23. `updateCandidateStage(candidateId: number, stage: string)`:
    - This function sends an HTTP PUT request to the server endpoint `/candidates/${candidateId}/stage` to update the stage of a candidate in the hiring process.
    - It takes the `stage` as the request body and the `candidateId` to identify the candidate to be updated.
    - It returns an `Observable<any>` with no specific data to be emitted upon successful update.

24. `getCandidatesWithStage(stage: number, pageNumber: number, pageSize: number, sortField: string = 'asc', sortOrder: string)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/stage/${stage}` with query parameters for pagination and sorting to get candidates filtered by stage.
    - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.

25. `getCandidatesWithStageAndKeywords(stage: number, keywords: string[], pageIndex: number, pageSize: number)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/search/stage/${stage}` with query parameters for filtering candidates by stage and keywords.
    - It returns an `Observable<CandidateResponse[]>` that will emit an array of `CandidateResponse` objects representing the candidates received from the server.

26. `getCandidatesWithStageAndFilters(stage: number, pageIndex: number, pageSize: number, params: URLSearchParams)`:
    - This function sends an HTTP GET request to the server endpoint `/candidates/filter/stage/${stage}` with query parameters and filters to get candidates by stage and custom filters.
    - It returns an `Observable<Page<CandidateResponse>>` that will emit a `Page<CandidateResponse>` object representing the paginated list of candidates received from the server.

Note: The code assumes the existence of the `Candidate`, `CandidateFeedback`, and `CandidateResponse` interfaces (or classes) that define the data structure of the candidate, candidate feedback, and response objects, respectively.

**EmailService**

Let's go through each function of the `EmailService` in detail:

1. `sendSimpleEmail(email: Email)`:
   - This function sends a simple email using an HTTP POST request to the server endpoint `/email/sendEmail`.
   - It takes an `email` object of type `Email` as the request body. The `Email` object typically contains properties like `receiverEmail`, `subject`, and `messageBody`.
   - The response type is set to `'text'`, indicating that the response from the server is expected to be plain text.
   - It returns an `Observable<string>` that will emit the response text received from the server, which is typically a success message or an error message.

2. `sendEmailWithAttachments(email: Email, files: File[])`:
   - This function sends an email with attachments using an HTTP POST request to the server endpoint `/email/sendEmailWithAttachment`.
   - It takes an `email` object of type `Email` and an array of `files` as the input. The `Email` object contains properties like `receiverEmail`, `subject`, and `messageBody`, while the `files` array contains the selected files to be attached to the email.
   - The function creates a new `FormData` object and appends the necessary fields (e.g., `receiverEmail`, `subject`, `messageBody`, and files) to it.
   - For each file in the `files` array, it appends the file to the `FormData`.
   - The `FormData` object is used as the request body to send the email with attachments.
   - It returns an `Observable<any>` that will emit the response received from the server, which typically contains information about the success or failure of sending the email.

**JobService**

Let's go through each function in the `JobService` in detail:

1. `handleError<T>(operation = 'operation', result?: T)`:
   - This is a utility function used to handle errors in HTTP requests.
   - It is a higher-order function that takes the `operation` (a string representing the operation that failed) and an optional `result` of type `T` (a default value to return if there's an error).
   - The function returns a lambda (arrow) function that takes an `error` of type `any` and returns an `Observable` of type `T`.
   - Inside the lambda function, it logs the error message to the console and then returns an `Observable` emitting the `result` (default value) casted as type `T`.
   - This function is used as a catch handler in several HTTP requests to handle errors gracefully and prevent the application from crashing due to unhandled errors.

2. `getJobs(pageSize: number = 5, pageIndex: number = 0, sortField: string = 'id', sortOrder: string = 'asc')`:
   - This function retrieves a paginated list of jobs from the server using an HTTP GET request.
   - It takes four optional parameters: `pageSize`, `pageIndex`, `sortField`, and `sortOrder`, which determine the number of jobs to fetch per page, the page index, the field to sort the results by, and the sort order ('asc' or 'desc'), respectively.
   - It returns an `Observable` that emits an array of `JobResponse` objects representing the jobs retrieved from the server.

3. `getJobById(jobId: number)`:
   - This function retrieves a specific job by its `jobId` using an HTTP GET request.
   - It takes `jobId` as a parameter.
   - It returns an `Observable` that emits a single `JobResponse` object representing the job with the specified `jobId`.

4. `postJob(jobPosition: JobResponse)`:
   - This function creates a new job by sending an HTTP POST request to the server with the provided `jobPosition` object as the request body.
   - It takes `jobPosition` of type `JobResponse` (representing the job details) as a parameter.
   - It returns an `Observable` that emits the created `JobResponse` object representing the newly added job.

5. `getTotalJobCount()`:
   - This function retrieves the total number of jobs available on the server using an HTTP GET request to the `/jobs/count` endpoint.
   - It returns an `Observable` that emits a single number representing the total job count.

6. `getCandidateCountByJob(jobId: number)`:
   - This function retrieves the number of candidates associated with a specific job by its `jobId` using an HTTP GET request to the `/candidates/${jobId}/count` endpoint.
   - It takes `jobId` as a parameter.
   - It returns an `Observable` that emits a single number representing the count of candidates associated with the specified job.

7. `updateJob(jobId: number, jobPosition: JobResponse)`:
   - This function updates an existing job by sending an HTTP PUT request to the server with the provided `jobPosition` object as the request body.
   - It takes `jobId` and `jobPosition` of type `JobResponse` (representing the updated job details) as parameters.
   - It returns an `Observable` that emits the updated `JobResponse` object representing the modified job.

8. `deleteJobPosition(jobId: number)`:
   - This function deletes a specific job by its `jobId` using an HTTP DELETE request to the `/jobs/${jobId}` endpoint.
   - It takes `jobId` as a parameter.
   - It returns an `Observable` with no emitted value, representing the completion of the delete operation.

**ExportToExcelService**

Let's go through each function in the `ExportToExcelService`:

1. `exportAllCandidatesData()`:
   - This function is used to export all candidates' data in an Excel format.
   - It sends an HTTP GET request to the server's `/candidates/export/AllCandidates` endpoint.
   - The `responseType` is set to `'arraybuffer'` to handle binary data like Excel files.
   - It returns the raw HTTP response with the Excel data as an array buffer.

2. `exportJobPositionsData()`:
   - This function is used to export job positions data in an Excel format.
   - It sends an HTTP GET request to the server's `/candidates/export/JobPositions` endpoint.
   - The `responseType` is set to `'arraybuffer'` to handle binary data like Excel files.
   - It also sets the `Content-Type` header to `'application/json'`.
   - It returns the raw HTTP response with the Excel data as an array buffer.

3. `exportCandidateFeedbackData()`:
   - This function is used to export candidate feedback data in an Excel format.
   - It sends an HTTP GET request to the server's `/candidates/export/CandidateFeedback` endpoint.
   - The `responseType` is set to `'arraybuffer'` to handle binary data like Excel files.
   - It also sets the `Content-Type` header to `'application/json'`.
   - It returns the raw HTTP response with the Excel data as an array buffer.

4. `exportSampleExcelFile()`:
   - This function is used to export a sample Excel file.
   - It sends an HTTP GET request to the server's `/candidates/export/SampleExcel` endpoint.
   - The `responseType` is set to `'arraybuffer'` to handle binary data like Excel files.
   - It also sets the `Content-Type` header to `'application/json'`.
   - It returns the raw HTTP response with the Excel data as an array buffer.

5. `uploadFile(file: File)`:
   - This function is used to upload a file to the server.
   - It takes a `File` object representing the file to be uploaded as a parameter.
   - It creates a `FormData` object, appends the file to it with the key `'file'`, and sends an HTTP POST request to the server's `/candidates/uploadExcel` endpoint with the `FormData`.
   - The response type is not specified here, so it will be the default JSON response.
   - It returns an `Observable` that emits the HTTP response with the result of the file upload.

The `ExportToExcelService` is responsible for handling the communication with the server to export Excel data and upload files.



## Interview Feature

The Interview Feature comprises of ten components:

(1) `Box rating`

(2) `Candidate feedback form`

(3) `Candidates`

(4) `Edit Candidate form`

(5) `Email form`

(6) `Feedbacks form`

(7) `Interviewer Note`

(8) `Job Position form`

(9) `Job Position`

(10) `Star rating`

1. Box rating

The code provided is an Angular component called `BoxRatingComponent`. It represents a box rating system where users can select a rating by clicking on one of the boxes representing the rating value. Let's go through the different parts of the component:

**1. `@Input()` properties:**
   - `maxRating`: The maximum rating value available for selection (default value is 10).
   - `rating`: The current rating value selected by the user.
   - `reset`: A boolean input that allows resetting the current rating and hover rating if set to `true`.
   - `disableColorChange`: A boolean input that determines if the color change on hover is disabled.

**2. `@Output()` property:**
   - `ratingChanged`: An EventEmitter that emits the selected rating value when the user changes the rating.

**3. Properties:**
   - `currentRating`: The current selected rating value (null initially).
   - `hoverRating`: The rating value that the user is hovering over (null initially).
   - `ratings`: An array of numbers representing the available rating values (from 1 to `maxRating`).

**4. `providers`:** The component provides itself as the value accessor for Angular forms, allowing it to be used in forms with `ngModel`.

**5. Constructor:**
   - Initializes the `ratings` array based on the `maxRating` input.

**6. `ngOnInit()` lifecycle hook:**
   - Sets the initial rating value based on the `rating` input.

**7. `ngOnChanges()` lifecycle hook:**
   - Listens for changes to the `reset` input, and if it is set to `true`, resets the `currentRating` and `hoverRating` to null.

**8. Methods:**
   - `setRating(rating: number)`: Sets the current rating value, emits the rating change event, and calls the registered `onChange` and `onTouched` functions.
   - `setHoverRating(rating: number)`: Sets the `hoverRating` value when the user hovers over a rating box (only if the current rating is not set).
   - `clearHoverRating()`: Clears the `hoverRating` value when the user moves the cursor away from the rating boxes (only if the current rating is not set).
   - `writeValue(rating: number)`: Implements the `ControlValueAccessor` interface to set the current rating value from an external source (used with `ngModel`).
   - `registerOnChange(fn: any)`: Implements the `ControlValueAccessor` interface to register a function to be called when the rating value changes (used with `ngModel`).
   - `registerOnTouched(fn: any)`: Implements the `ControlValueAccessor` interface to register a function to be called when the rating component is touched (used with `ngModel`).

This component can be used in templates to provide a rating system, and it can also be integrated with Angular forms using `ngModel`. When the user selects a rating, the `ratingChanged` event is emitted, and the current rating value can be obtained through two-way data binding using `[(ngModel)]`.

2. Candidate feedback form

The code provided is an Angular component called `CandidateFeedbackFormComponent`. It represents a form used to submit feedback for a candidate interview. Let's go through the different parts of the component:

**1. Properties:**
   - `candidateFeedbackForm`: A `FormGroup` that represents the feedback form containing various fields such as candidate name, date of interview, ratings, comments, result, etc.
   - `resetRatings`: A boolean flag to reset the ratings.
   - `maxDate`: A `Date` object used to set the maximum date for the date picker in the form.
   - `url`: A string variable to store the current URL path.
   - `jobTitles`: An array of strings containing job titles fetched from the server.
   - `results`: An array of string options representing the possible feedback results.
   - `candidateResult`: A string variable representing the selected feedback result.
   - `candidateId`: A number representing the candidate's ID.
   - `key`: A number representing a key parameter (optional).
   - `job_id`: A number representing the ID of the job position applied for by the candidate.

**2. Constructor:**
   - Initializes the `candidateFeedbackForm` using `formBuilder.group()` with validation rules for each form control.

**3. `ngOnInit()` lifecycle hook:**
   - Fetches the list of job titles using the `jobService.getJobs()` method.
   - Sets the `url` property based on the current URL path.
   - Subscribes to route parameters to get the `candidateId` and optional `key`.
   - Calls `fetchCandidateName()` and `fetchCandidatePosition()` to populate the candidate's name and applied job position in the form.

**4. Methods:**
   - `fetchJobs()`: Fetches the list of job titles from the server using `jobService.getJobs()` and stores them in the `jobTitles` array.
   - `fetchCandidateName(candidateId: number)`: Fetches the candidate's name from the server using `candidateService.getCandidateName()` and populates it in the form.
   - `fetchCandidatePosition(candidateId: number)`: Fetches the job position applied for by the candidate from the server using `candidateService.getCandidatePosition()` and sets it in the form.
   - `submitFeedback()`: Submits the feedback form if it is valid. It creates a `CandidateFeedback` object from the form values and calls `candidateService.addCandidateFeedback()` to add the feedback for the candidate. If successful, it resets the form and displays a success message using the `MatSnackBar`.
   - `navigateBack()`: Navigates back to the previous page based on the `url`. If the current URL is 'jobs', it navigates to the job-specific candidate search page; otherwise, it navigates back to the dashboard page.

The component interacts with the `CandidateService`, `JobService`, and Angular `Router` to fetch data and handle form submissions. It also uses the Angular Material `MatSnackBar` to display feedback messages. The form controls have validations, and if there are any invalid fields on form submission, an error message is displayed in a snackbar.

3. Candidates

The code provided is an Angular component called `CandidatesComponent`. It represents a list of candidates associated with a specific job. Let's go through the different parts of the component:

**1. Properties:**
   - `candidates`: An array of `CandidateResponse` objects representing the list of candidates associated with the job.
   - `candidateId`: A number representing the ID of the selected candidate.
   - `displayedColumns`: An array of strings containing the column names to be displayed in the table.
   - `columnsToDisplayWithExpand`: An array of strings representing the columns to be displayed in the table with an expandable row.
   - `expandedElement`: A `CandidateResponse` object representing the currently expanded row in the table.
   - `dataSource`: A variable used to store the data source for the table.
   - `stages`: An array of strings representing different stages a candidate can be in.
   - `numberOfFeedbacks`: A number representing the total number of feedbacks for a candidate.
   - `jobId`: A number representing the ID of the job associated with the candidates.
   - `isLoading`: A boolean flag to indicate whether data is being loaded or not.
   - `length`: A number representing the total number of candidates for pagination.
   - `pageIndex`: A number representing the current page index for pagination.
   - `pageSize`: A number representing the number of candidates to display per page.
   - `rounds`: An array of numbers representing different rounds of the interview process.
   - `role`: A boolean flag representing the user's role.

**2. Constructor:**
   - Initializes the component and injects the required services.

**3. `ngOnInit()` lifecycle hook:**
   - Subscribes to route parameters to get the `jobId`.
   - Sets the job in the `candidateDataService`.
   - Fetches the candidates and candidate count associated with the job.
   - Initializes the table data source.

**4. Methods:**
   - `routeBack()`: Navigates back to the job list page.
   - `announceSortChange(sortState: Sort)`: Announces the sorting status for accessibility when the table is sorted.
   - `fetchResumeById(id: number)`: Fetches the resume of a candidate by their ID and opens it in a new tab for viewing or download.
   - `openFeedbackForm(candidateId: number)`: Navigates to the feedback form for the selected candidate.
   - `editCandidate(element: Candidate)`: Opens a dialog to edit the details of a candidate.
   - `showComments(candidateId: number)`: Navigates to the feedback comments for the selected candidate.
   - `addNote(element: Candidate)`: Opens a dialog to add notes for the selected candidate.
   - `sendEmail(element: Candidate)`: Opens a dialog to send an email to the selected candidate.
   - `onPageChange(event: PageEvent)`: Handles the page change event for pagination and fetches candidates based on the selected page and page size.
   - `updateCandidate(candidate: Candidate, candidateId: number)`: Updates the details of a candidate and refreshes the candidate list.
   - `updateStage(id: number, event: MatSelectChange)`: Updates the stage of a candidate and displays a success message or an error message in case of failure.
   - `updateRound(candidateId: number, event: MatSelectChange)`: Updates the round of a candidate and displays a success message or an error message in case of failure.
   - `fetchCandidates(columnName: string, sortDirection: string)`: Fetches candidates associated with the selected job and handles sorting based on the provided column name and sort direction.

The component interacts with various services such as `CandidateDataService`, `CandidateService`, `MatDialog`, `Router`, and `MatSnackBar` to manage candidate data, fetch data, perform CRUD operations, and display feedback messages. It also uses Angular Material components and animations to enhance the user interface and experience. Additionally, the component supports pagination and sorting of the candidate list.

4. Edit candidate form

The code provided is an Angular component called `EditCandidateFormComponent`. It represents a form to edit the details of a candidate. Let's go through the different parts of the component:

**1. Properties:**
   - `candidateForm`: An instance of `FormGroup` representing the candidate edit form.
   - `maxDate`: A `Date` object representing the maximum date allowed in date pickers (used to restrict future dates).
   - `skillCtrl` and `moreSkillCtrl`: Instances of `FormControl` used for handling skill and more skill input.
   - `filteredSkills` and `filteredMoreSkills`: Observables used for filtering and autocompleting skill and more skill inputs.
   - `skills` and `moreSkills`: Arrays to store the selected skills and more skills, respectively.
   - `openPositions`: An array of `JobResponse` objects representing the list of open job positions.
   - `selectedJobId`: A number representing the ID of the selected job position.
   - `separatorKeysCodes`: An array of numbers representing the key codes for separator keys (used for chip input).
   - Various properties related to slider input configuration, file upload, and snackbar settings.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.
   - Initializes the form using Angular's `FormBuilder`.
   - Sets up the observables for skill and more skill filtering and autocompletion.

**3. `ngOnInit()` lifecycle hook:**
   - Sets the maximum date for date pickers.
   - Sets up observables for filtering states and cities for current and permanent addresses.
   - Fetches the list of open job positions and populates the `openPositions` array.
   - Fetches the candidate data by ID and populates the form with the candidate's details.

**4. Methods:**
   - Various methods to handle form interactions and events, including adding and removing employment history, adding and removing skills, handling file upload, and filtering states and cities.
   - `setFormValues(candidateData: Candidate)`: Populates the form with the provided `Candidate` data.
   - `addEmploymentHistory()`: Creates a new `FormGroup` for employment history and adds it to the `employment` form array.
   - `removeEmployment(index: number)`: Removes an employment history entry from the `employment` form array.
   - `addEmployment()`: Adds an empty employment history entry to the `employment` form array.
   - `onCheck(event: MatRadioChange)`: Handles the radio button change event to check if the candidate is a fresher or not.
   - `addSkill(event: MatChipInputEvent)`: Adds a skill to the `skills` array.
   - `removeSkill(skill: string)`: Removes a skill from the `skills` array.
   - `selectedSkill(event: MatAutocompleteSelectedEvent)`: Adds a skill to the `skills` array when selected from the autocomplete options.
   - `addMoreSkill(event: MatChipInputEvent)`: Adds a skill to the `moreSkills` array.
   - `removeMoreSkill(skill: string)`: Removes a skill from the `moreSkills` array.
   - `selectedMoreSkill(event: MatAutocompleteSelectedEvent)`: Adds a skill to the `moreSkills` array when selected from the autocomplete options.
   - `getJobPositions()`: Fetches the list of open job positions.
   - `getCandidateById()`: Fetches the candidate data by ID and populates the form with the retrieved details.
   - `closeDialog()`: Closes the dialog without submitting the form.
   - `submitForm()`: Submits the form by updating the candidate details and closes the dialog with the updated candidate data.

The component provides functionalities for editing candidate details, selecting skills and more skills using chips and autocompletion, and updating the candidate data on form submission. It also handles file upload for resumes and performs validation on form inputs.

5. Email form

The provided code represents an Angular component called `EmailFormComponent`. It is responsible for sending emails to a candidate. Let's go through the different parts of the component:

**1. Properties:**
   - `emailForm`: An instance of `FormGroup` representing the email form containing fields like receiverEmail, subject, and messageBody.
   - `selectedFiles`: An array of `File` objects representing the selected files to be attached to the email.
   - `matcher`: An instance of `MyErrorStateMatcher` class used for handling error state of form controls.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.
   - Sets up the email form using Angular's `FormBuilder` with validators for the receiverEmail, subject, and messageBody fields.

**3. `ngOnInit()` lifecycle hook:**
   - Fetches the candidate data by ID using the `CandidateService`.
   - Sets the `receiverEmail` field value in the email form with the candidate's email address.

**4. `MyErrorStateMatcher` class:**
   - A custom implementation of `ErrorStateMatcher` used to determine whether a form control is in an error state based on its validity and user interaction.

**5. Methods:**
   - `closeDialog()`: Closes the dialog without submitting the email form.
   - `onFileSelected(event: any)`: Handles the file selection event to store the selected files for attachment.
   - `sendMail()`: Sends the email using the `EmailService`. If files are selected, it uses `sendEmailWithAttachments` method, otherwise, it uses `sendSimpleEmail` method to send a simple email.
     - The `sendEmailWithAttachments` method sends an email with attachments to the specified `receiverEmail` with the given `subject`, `messageBody`, and selected files.
     - The `sendSimpleEmail` method sends a simple email with the specified `subject` and `messageBody` to the `receiverEmail`.

When the user submits the email form, the `sendMail()` method is called, and the email is sent using the appropriate service method based on whether files are attached or not. If the email is successfully sent, a success message is displayed using a snackbar, and if there's an error, an error message is displayed.

Overall, this component provides functionalities to send emails with or without attachments to a specified receiver email address, subject, and message body. It also handles form validation for the email fields.

6. Feedbacks form

The provided code represents an Angular component called `FeedbacksComponent`. It is responsible for displaying candidate feedback for a specific job position. Let's go through the different parts of the component:

**1. Properties:**
   - `candidateFeedbacks`: An array of `CandidateFeedback` objects representing the feedback received for the candidate.
   - `candidateId`: The ID of the candidate whose feedbacks are being displayed.
   - `jobId`: The ID of the job for which the feedbacks are being displayed.
   - `numberOfFeedbacks`: The total number of feedbacks received for the candidate.
   - `positions`: An array of `JobResponse` objects representing job positions.
   - `jobTitles`: An array of strings representing the titles of available job positions.
   - `results`: An array of strings representing the possible feedback results.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.

**3. `ngOnInit()` lifecycle hook:**
   - Invoked when the component is initialized.
   - Calls `fetchJobs()` to fetch the available job positions.
   - Calls `setCandidateId()` to extract the candidate ID from the route parameters.
   - Calls `fetchFeedbacks()` to fetch the candidate feedbacks for the given candidate ID.
   - Calls `setJobId()` to extract the job ID from the `CandidateDataService`.

**4. Methods:**
   - `setJobId()`: Retrieves the job ID from the `CandidateDataService`.
   - `routeBack()`: Navigates back to the candidate search page for the specific job.
   - `setCandidateId()`: Extracts the candidate ID from the route parameters using `ActivatedRoute`.
   - `openFeedbackForm()`: Navigates to the feedback form page for the specific candidate.
   - `fetchFeedbacks()`: Fetches the candidate feedbacks using `CandidateService`. Updates the `candidateFeedbacks` array with the response data and calculates the `numberOfFeedbacks`.
   - `fetchJobs()`: Fetches the available job positions using `JobService`. Updates the `jobTitles` array with the titles of the job positions.

The component is designed to display candidate feedback for a specific candidate and job position. It allows users to navigate back to the candidate search page, view feedback details, and access the feedback form to provide new feedback for the candidate. The feedbacks are fetched from the server using `CandidateService`, and the job positions are fetched using `JobService`.

7. Interviewer Note

The provided code represents an Angular component called `InterviewerNoteComponent`. It is responsible for displaying and adding interviewer notes for a specific candidate. Let's go through the different parts of the component:

**1. Properties:**
   - `interviewerNotes`: A `FormGroup` that contains a `FormControl` for the additional notes added by the interviewer.
   - `previousNote`: A string property to store the previous note of the candidate if available.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.
   - Initializes the `interviewerNotes` form group with a single form control for additional notes.

**3. `ngOnInit()` lifecycle hook:**
   - Invoked when the component is initialized.
   - Calls `fetchCandidateById()` to fetch the candidate details by ID, including any existing interviewer notes.

**4. Methods:**
   - `fetchCandidateById()`: Fetches the candidate details, including any existing interviewer notes, using `CandidateService`. Updates the `interviewerNotes` form group with the existing note if available.
   - `closeDialog()`: Closes the dialog without submitting the form by calling `dialogRef.close()`.
   - `submitNote()`: Submits the additional notes provided by the interviewer for the candidate using `CandidateService`. Displays a snackbar message on successful addition of the note. Calls `closeDialog()` after submitting the note.

The component allows the interviewer to view the existing notes for the candidate and add new notes through a dialog. The notes are fetched from the server using `CandidateService`, and the dialog is opened using `MatDialogRef`. The interviewer can submit the new note, which will be added to the candidate's record using `CandidateService`.

8. Job Position form

The provided code represents an Angular component called `JobPositionFormComponent`. It is responsible for displaying and managing a form to add or edit job positions. Let's go through the different parts of the component:

**1. Properties:**
   - `jobPositionForm`: A `FormGroup` that represents the form for adding/editing job positions. It contains form controls for various fields like job title, job status, hiring managers (using `FormArray`), requirements, and job description.
   - `jobTitle`: A string property to store the job title.
   - `isLoading`: A boolean flag to indicate whether the form is currently submitting data or loading data.
   - `selectedFile`: A `File` object to store the selected job description file.
   - `hiringManagersInput`: An array of strings to store the names of hiring managers entered as input by the user.
   - `addOnBlur`: A boolean flag to specify whether a chip should be added when the input field loses focus.
   - `separatorKeysCodes`: An array of keycodes (ENTER and COMMA) used as the separator for the hiring managers' input.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.
   - Initializes the `jobPositionForm` with form controls using the `FormBuilder`.
   - Calls `initializeForm()` to initialize the `hiringManagers` FormArray.

**3. `ngOnInit()` lifecycle hook:**
   - Invoked when the component is initialized.
   - If data is provided (indicating edit mode), it calls `fetchJobById()` to fetch the job details by ID and populate the form for editing.

**4. Methods:**
   - `onFileSelected(event: any)`: Handles the file input change event when the user selects a job description file. It reads the file content and updates the `jobPositionForm` with the base64-encoded file data.
   - `initializeForm()`: Initializes the `hiringManagers` FormArray with the names of hiring managers from `hiringManagersInput`.
   - `closeModal()`: Closes the dialog without submitting the form by calling `dialogRef.close()`.
   - `add(event: MatChipInputEvent)`: Handles the event when a hiring manager name is added as a chip. Adds the hiring manager to the `hiringManagers` FormArray.
   - `remove(manager: any)`: Removes a hiring manager from the `hiringManagers` FormArray.
   - `edit(manager: any, event: MatChipEditedEvent)`: Handles the event when a hiring manager's name is edited. Updates the name in the `hiringManagersInput`.
   - `fetchJobById()`: Fetches the job details by ID using `JobService` and populates the form for editing.
   - `submitForm()`: Submits the job position form. If the form is valid, it either adds a new job or updates an existing job using `JobService`. Displays a snackbar message on success or failure.

The component includes functionality to add and remove hiring managers using chips and provides form validation to ensure all required fields are filled before submission.

9. Job Position

The provided code represents an Angular component called `JobPositionsComponent`. This component is responsible for displaying a table of job positions with various actions like adding, editing, and deleting job positions. Let's go through the different parts of the component:

**1. Properties:**
   - `dataSource`: An instance of `MatTableDataSource` that holds the data for the job positions to be displayed in the table.
   - `jobs`: An array of `JobResponse` objects representing the job positions fetched from the server.
   - `columnsToDisplay`: An array of strings representing the column names to be displayed in the table.
   - `columnsToDisplayWithExpand`: An extended version of `columnsToDisplay` with an additional column for expansion.
   - `expandedElement`: An object of type `JobResponse` representing the currently expanded row in the table.
   - `jobsCount`: A number representing the total count of job positions.
   - `candidateCount`: A number representing the count of candidates for each job position.
   - `pageIndex`: A number representing the current page index of the table.
   - `pageSize`: A number representing the number of job positions to be displayed per page.
   - `isLoading`: A boolean flag to indicate whether data is being fetched from the server.
   - `openModalSwitch`: A boolean flag to control the opening of the job position form modal.

**2. Constructor:**
   - Initializes the component and injects the required services and dependencies.

**3. `ngOnInit()` lifecycle hook:**
   - Invoked when the component is initialized.
   - Calls `fetchJobs()` and `getJobCount()` to fetch job positions and the total job count.

**4. Methods:**
   - `openModal(jobId?: number)`: Opens the job position form modal. If a `jobId` is provided, it opens the form in edit mode; otherwise, it opens the form for adding a new job position.
   - `isValidBase64String(str: string)`: Checks if a string is a valid base64-encoded string.
   - `getFileMimeType(base64: string)`: Determines the file MIME type based on the base64 data.
   - `compareByteArrays(array1: Uint8Array, array2: number[])`: Compares two byte arrays and returns `true` if they are equal.
   - `showFileInNewTab(base64: string, fileName: string, mimeType: string)`: Opens the file in a new tab for the provided base64 data, file name, and MIME type.
   - `showJobDescription(element: any)`: Shows the job description file in a new tab when the user clicks on the job description column.
   - `getJobCount()`: Fetches the total count of job positions.
   - `editJob(jobId: number)`: Opens the job position form modal in edit mode for the specified `jobId`.
   - `openDeleteConfirmationDialog(jobId: number)`: Opens the delete confirmation dialog for the specified `jobId`.
   - `deleteJob(jobId: number)`: Deletes the job position with the specified `jobId` using `JobService`.
   - `fetchCandidateCount(jobs: JobResponse[])`: Fetches the count of candidates for each job position and updates the `jobCount` property of each `JobResponse` object.
   - `onPageChange(event: PageEvent)`: Handles the page change event when the user changes the page in the table.
   - `fetchCandidates(id: number)`: Navigates to the candidate search page for the specified job position `id`.
   - `announceSortChange(sortState: Sort)`: Announces the sort change using `LiveAnnouncer`.
   - `fetchJobs(columnName: string = 'jobTitle', sortDirection: string = 'asc')`: Fetches the job positions using `JobService` with optional sorting parameters.

**5. Animations:**
   - The component uses Angular animations to expand/collapse rows in the table when the user clicks on the "expand" icon.

Overall, this component displays a table of job positions with pagination support. It allows users to add, edit, and delete job positions using a modal form and provides various functionalities like sorting and expanding rows. The data for job positions is fetched from the server using the `JobService`.

10. Star rating

The provided code represents an Angular component called `StarRatingComponent`, which is a custom form control for creating a star rating input. Let's go through the different parts of the component:

**1. Properties:**
   - `maxRating`: An input property representing the maximum rating value. The default value is set to 10.
   - `rating`: An input property representing the current rating value.
   - `disableColorChange`: An input property that, when set to `true`, disables the color change effect when hovering over the stars.
   - `reset`: An input property that, when set to `true`, resets the current rating and hover rating to null. It is used to reset the rating programmatically from the parent component.
   - `ratingChanged`: An output property of type `EventEmitter<number>` that emits the new rating value when the user changes the rating.

**2. Local Properties:**
   - `currentRating`: A local property that holds the current rating value.
   - `hoverRating`: A local property that holds the rating value when the user hovers over the stars.
   - `ratings`: An array of numbers representing the available rating values from 1 to `maxRating`.

**3. ControlValueAccessor Implementation:**
   - The component implements the `ControlValueAccessor` interface to integrate with Angular's form control API.
   - The `writeValue(rating: number)` method sets the current rating value when the form control receives a new value.
   - The `registerOnChange(fn: any)` and `registerOnTouched(fn: any)` methods register the functions to be called when the form control value changes or when the form control is touched, respectively.
   - The `onChange` and `onTouched` properties are initialized with empty functions, which will be replaced by the registered functions from the parent form control.

**4. Constructor:**
   - Initializes the component and initializes the `ratings` array to contain numbers from 1 to `maxRating`.

**5. `ngOnChanges(changes: SimpleChanges)` lifecycle hook:**
   - Invoked when input properties are updated.
   - When the `reset` input property changes and its new value is `true`, it resets the `currentRating` and `hoverRating` to null.

**6. `ngOnInit()` lifecycle hook:**
   - Invoked when the component is initialized.
   - Calls the `setRating()` method to initialize the current rating based on the input `rating`.

**7. Methods:**
   - `setRating(rating: number)`: Sets the current rating, emits the new rating value using the `ratingChanged` output property, and calls the registered `onChange` and `onTouched` functions.
   - `setHoverRating(rating: number)`: Sets the hover rating if the current rating is not provided (i.e., no initial rating value is set).
   - `clearHoverRating()`: Clears the hover rating if the current rating is not provided.
   - `writeValue(rating: number)`: Implements the `writeValue()` method from `ControlValueAccessor`.
   - `registerOnChange(fn: any)`: Implements the `registerOnChange()` method from `ControlValueAccessor`.
   - `registerOnTouched(fn: any)`: Implements the `registerOnTouched()` method from `ControlValueAccessor`.

This `StarRatingComponent` allows users to select a star rating and emits the selected rating value through the `ratingChanged` event. It can be used as a custom form control in Angular reactive forms to capture and display star ratings in the UI.


## Core Models 
Core has Models which has nine components

(1) `Candidate`

(2) `Candidate Feedback`

(3) `Candidate Response`

(4) `City`

(5) `Email`

(6) `Employment`

(7) `Job Response`

(8) `Page`

(9) `User`


**1. Candidate**

The provided code defines an interface called `Candidate`, which represents the properties and structure of a candidate in the application. Let's go through the different properties of the `Candidate` interface:

1. `id`: A number representing the unique identifier of the candidate.
2. `firstName`: A string representing the first name of the candidate.
3. `lastName`: A string representing the last name of the candidate.
4. `email`: A string representing the email address of the candidate.
5. `address`: An object containing the current and permanent address of the candidate, each with properties for country, state, and city.
6. `mobilePhone`: A string representing the mobile phone number of the candidate.
7. `links`: An array of strings representing links related to the candidate (e.g., personal website, LinkedIn profile).
8. `employment`: An array of `Employment` objects representing the candidate's employment history.
9. `education`: An object representing the candidate's education, with properties for the highest degree, specialization, and year of achievement.
10. `source`: A string representing the source from which the candidate was referred or hired.
11. `referral`: An object containing the first name and last name of the person who referred the candidate (if applicable).
12. `note`: A string representing additional notes about the candidate.
13. `notesByInterviewer`: A string representing notes added by the interviewer about the candidate.
14. `resume`: A `File` object or null representing the candidate's resume file.
15. `keySkills`: An array of strings representing the key skills possessed by the candidate.
16. `mayKnowSkills`: An array of strings representing additional skills that the candidate may know.
17. `totalExperience`: A string representing the total work experience of the candidate.
18. `currentCTC`: A string representing the candidate's current CTC (Cost to Company).
19. `expectedCTC`: A string representing the candidate's expected CTC.
20. `currentNoticePeriod`: A string representing the candidate's current notice period for the job.
21. `job_id`: A number representing the identifier of the job for which the candidate is being considered.
22. `workMode`: A string representing the work mode of the candidate (e.g., full-time, part-time).
23. `communicationSkills`: A string representing the communication skills of the candidate.
24. `round`: An optional number representing the interview round for the candidate (if applicable).
25. `stage`: A string representing the current stage of the candidate in the hiring process.
26. `candidateFeedback`: An optional array of `CandidateFeedback` objects representing feedback given for the candidate (if applicable).

Overall, the `Candidate` interface provides a structure to represent candidate information in the application, including personal details, employment history, education, skills, and other relevant attributes.

**2. Candidate Feedback**

The `CandidateFeedback` interface represents the feedback provided for a candidate after an interview. Let's go through the different properties of the `CandidateFeedback` interface:

1. `candidateName`: A string representing the name of the candidate for whom the feedback is provided.
2. `dateOfInterview`: A `Date` object representing the date of the interview for which the feedback is given.
3. `positionAppliedFor`: A number representing the identifier of the position applied for by the candidate.
4. `interviewer`: A string representing the name or identifier of the interviewer who conducted the interview.
5. `round`: An optional number representing the interview round for which the feedback is given (if applicable).
6. `educationalBackgroundRating`: A number representing the rating given to the candidate's educational background in the interview.
7. `workExperienceRating`: A number representing the rating given to the candidate's work experience in the interview.
8. `technicalSkillsRating`: A number representing the rating given to the candidate's technical skills in the interview.
9. `communicationSkillsRating`: A number representing the rating given to the candidate's communication skills in the interview.
10. `candidateInterestRating`: A number representing the rating given to the candidate's interest and enthusiasm for the position in the interview.
11. `interpersonalSkillsRating`: A number representing the rating given to the candidate's interpersonal skills in the interview.
12. `overallRating`: A number representing the overall rating or assessment of the candidate's performance in the interview.
13. `comments`: A string representing any additional comments or feedback provided by the interviewer.
14. `result`: A string representing the result or outcome of the interview for the candidate (e.g., "Selected," "Rejected," "On Hold").

The `CandidateFeedback` interface allows for capturing and storing detailed feedback about a candidate's interview performance, including ratings across various skill areas and overall assessment. This feedback can be valuable for decision-making in the hiring process and for providing constructive feedback to the candidate.

**3. candidate Response**

The `CandidateResponse` interface represents the response data for a candidate, typically retrieved from an API or database query. Let's go through the different properties of the `CandidateResponse` interface:

1. `id`: A number representing the unique identifier of the candidate.
2. `firstName`: A string representing the first name of the candidate.
3. `lastName`: A string representing the last name of the candidate.
4. `email`: A string representing the email address of the candidate.
5. `jobPosition`: An object representing the job position details applied for by the candidate.
   - `jobTitle`: A string representing the title of the job position applied for.
   - `hiringManager`: An array of strings representing the names or identifiers of hiring managers associated with the job position.
   - `jobStatus`: A string representing the status of the job position (e.g., "Open," "Closed," etc.).
6. `address`: An object representing the candidate's address details.
   - `currentAddress`: An object representing the current address of the candidate.
     - `currentCountry`: A string representing the current country of the candidate.
     - `currentState`: A string representing the current state of the candidate.
     - `currentCity`: A string representing the current city of the candidate.
   - `permanentAddress`: An object representing the permanent address of the candidate.
     - `permanentCountry`: A string representing the permanent country of the candidate.
     - `permanentState`: A string representing the permanent state of the candidate.
     - `permanentCity`: A string representing the permanent city of the candidate.
7. `currentCTC`: A string representing the current CTC (Cost to Company) of the candidate.
8. `expectedCTC`: A string representing the expected CTC (Cost to Company) of the candidate.
9. `currentNoticePeriod`: A string representing the current notice period of the candidate.
10. `totalExperience`: A string representing the total experience (in terms of years) of the candidate.
11. `enrolledDate`: A `Date` object representing the date when the candidate was enrolled or added to the system.
12. `source`: A string representing the source through which the candidate was referred or identified.
13. `skills`: An array of strings representing the key skills possessed by the candidate.
14. `mayKnowSkills`: An array of strings representing additional skills that the candidate may know.
15. `mobilePhone`: A string representing the mobile phone number of the candidate.
16. `candidateCode`: A string representing a unique code or identifier associated with the candidate.
17. `education`: An object representing the educational background details of the candidate.
    - `highestDegree`: A string representing the highest degree obtained by the candidate.
    - `specialization`: A string representing the specialization or major subject studied by the candidate.
    - `yearOfAchievement`: A `Date` object representing the year of achievement or completion of the highest degree.
18. `workMode`: A string representing the work mode of the candidate (e.g., "Full-time," "Part-time," etc.).
19. `round`: A number representing the interview round number for which the candidate is being considered.
20. `stage`: An optional string representing the current stage of the candidate in the hiring process (e.g., "Interview," "Offer," etc.).
21. `feedbackLength`: An optional number representing the length of the candidate's feedback data.

The `CandidateResponse` interface provides a structured representation of candidate data, making it easier to work with candidate information retrieved from external sources or databases. The interface allows developers to access specific properties and their respective types while working with candidate data in TypeScript.

**4. City**

The City interface represents a simple data structure for defining a city. It typically contains a single property:

`name:` A string representing the name of the city.
This interface allows you to define city objects with a standardized structure, making it easier to work with city data in TypeScript. 

**5. Email**

The Email interface represents a data structure for defining an email object. It typically contains three properties:

`receiverEmail`: A string representing the email address of the recipient.
`messageBody`: A string representing the main content of the email message.
`subject`: A string representing the subject of the email.

This interface allows you to define email objects with a standardized structure, making it easier to work with email data in TypeScript.

By defining an interface for emails, you can enforce a consistent structure and type for email objects throughout your application, ensuring that the correct properties are used and accessed when working with email data. This can be particularly useful when sending emails using Angular or other frameworks where type checking and data validation are important.

**6. Employment**

The `Employment` interface represents a data structure for defining information related to a candidate's employment history. It typically contains the following properties:

1. `companyName`: A string representing the name of the company the candidate worked for.
2. `designation`: A string representing the job designation or title held by the candidate at the company.
3. `previousCTC`: A string representing the candidate's previous Cost to Company (CTC), which is the total salary package offered by the employer.
4. `location`: A string representing the location where the candidate worked for the company.
5. `workingStatus`: A string representing the candidate's working status during the employment, such as "Full-time," "Part-time," "Contract," etc.
6. `start`: A Date object representing the start date of the candidate's employment at the company.
7. `finish`: A Date object representing the end date of the candidate's employment at the company, or the current date if still employed.

This interface allows you to define employment history objects with a standardized structure, making it easier to work with employment data in TypeScript. For example, you can use this interface to create and manage employment history objects:


By defining an interface for employment history, you can enforce a consistent structure and type for employment objects throughout your application, ensuring that the correct properties are used and accessed when working with employment data. This can be particularly useful when managing a candidate's work history or displaying employment information in Angular or other frameworks.

**7. Job Response**

The `JobResponse` interface represents a data structure for defining information related to a job position. It typically contains the following properties:

1. `jobCount` (optional): A number representing the count of candidates associated with this job position. This property is optional and may not be present in all responses.
2. `id`: A number representing the unique identifier of the job position.
3. `jobTitle`: A string representing the title or name of the job position.
4. `hiringManagers`: An array of strings representing the names of the hiring managers associated with the job position. It contains the names of one or more individuals responsible for hiring candidates for this position.
5. `requirements`: A string representing the requirements or qualifications for the job position.
6. `jobStatus`: A string representing the status of the job position, such as "Open," "Closed," or "Pending."
7. `jobDescription`: A File object or `null` representing the job description file associated with the job position. This property may contain the file containing the detailed job description, such as a PDF or Word document.

This interface allows you to define job position objects with a standardized structure, making it easier to work with job-related data in TypeScript. For example, you can use this interface to create and manage job position objects:


By defining an interface for job positions, you can enforce a consistent structure and type for job objects throughout your application, ensuring that the correct properties are used and accessed when working with job-related data. This can be particularly useful when managing job positions or displaying job information in Angular or other frameworks.

**8. Page**

The `Page<T>` interface is a generic interface used to represent paginated data in a standardized format. It allows you to define paginated responses where the content is of type `T`. This interface typically contains the following properties:

1. `content`: An array of type `T` representing the actual data elements present on the current page.
2. `totalPages`: A number representing the total number of pages available in the paginated data set.
3. `totalElements`: A number representing the total number of elements across all pages in the paginated data set.
4. `number`: A number representing the current page number.
5. `size`: A number representing the number of elements per page.

By using the `Page<T>` interface, you can structure paginated responses consistently and provide information about the total number of elements and pages, allowing clients to navigate through paginated data effectively. The generic nature of the interface (`<T>`) allows you to use it with different types of data, making it flexible and reusable.

Here's an example of how the `Page<T>` interface can be used:

In Angular or other TypeScript applications, you can use the `Page<T>` interface to handle paginated responses from APIs, making it easier to work with paginated data and display it to users in a user-friendly manner.

**9. User**

The `User` interface represents the data structure for a user object, typically used to store user information after authentication. It contains the following properties:

1. `id`: A number representing the unique identifier of the user.
2. `username`: A string representing the username or login name of the user.
3. `roles`: An array of strings representing the roles or permissions associated with the user. These roles can determine the user's access rights within an application.

Here's an example of how the `User` interface can be used:


In practice, the `User` interface is often used in combination with authentication mechanisms in web applications. After a user logs in, the server provides the user's data in this format, and the client-side code can use this information to control access to various parts of the application based on the user's roles. For example, an admin role may have access to certain administrative features that regular users don't have. The `roles` property can be used to make such access control decisions on the client side.

