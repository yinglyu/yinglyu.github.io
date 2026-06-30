import React from "react";

import { NavBar } from './NavBar';
import { ResumeWrapper, MainContent, HeaderWrapper, Dates, Header, SubHeader, ResumeEntryWrapper, Description, SectionTitle } from './ResumeStyledComponents';

const resumeObject = {
    education: [
        { header: 'Texas A&M University', subHeader: 'Master of Computer Science', dates: '08/2019 - 12/2020', place: 'College Station, Texas', descriptions: ['GPA: 4.0/4.0', 'Department of Computer Science and Engineering Scholarship Spring & Fall 2020'] },
        { header: 'Beijing University of Posts and Telecommunications', subHeader: 'Bachelor of Computer Science, focus on Computer Network', dates: '09/2015 - 07/2019', place: 'Beijing, China', descriptions: ['GPA: 85.98/100 (Rank top 18/154)', 'BUPT Level-I Scholarship 2016-2017 (Rank top 5%)'] },
    ],
    work: [
        {
            header: 'Bloomberg L.P.', subHeader: 'Senior Software Engineer - Quality Platform', dates: '02/2024 - Current', place: 'Princeton, NJ', descriptions: [
                'Designed and evaluated approaches for handling high-volume span event data, conducting ClickHouse-based experiments to analyze throughput limits and storage bottlenecks across Kafka pipelines and distributed systems; informed tradeoffs between data fidelity and system constraints and identified data duplication issues for future optimization',
                'Owned end-to-end development of attribute-based query APIs, driving design decisions across data modeling, performance optimization, and downstream usability for analytics workflows',
                'Contributed to OpenTelemetry-based observability infrastructure, including collector customization and development of a Python API SDK for instrumentation, with built-in support for both FastAPI and Flask, improving consistency and adoption of distributed tracing across services',
                'Co-authored and presented a cross-team public cloud project proposal to the Cloud Governance Committee, aligning platform architecture with internal infrastructure standards and driving adoption discussions across organizations',
                'Proactively monitored system health and storage utilization (MySQL), identifying and mitigating capacity and reliability risks in production environments',
                'Collaborated with 5+ internal stakeholder teams to understand data quality requirements and translate them into platform capabilities, improving alignment between infrastructure and user needs',
                'Mentored teammates and onboarded new engineers; conducted technical interviews and contributed to broader engineering community initiatives through internal knowledge-sharing forums'
            ]
        },
        {
            header: 'Bloomberg L.P.', subHeader: 'Software Engineer - Cloud Computing Platform', dates: '01/2021 - 02/2024', place: 'Princeton, NJ', descriptions: [
                'Migrated the microservice platform from bare-metal Kubernetes clusters to an in-house Kubernetes-as-a-Service (KaaS) platform using Helm, standardizing deployments and improving scalability and resource efficiency',
                'Instrumented services with Prometheus metrics to enhance observability',
                'Created a Golang-based Out-of-Memory (OOM) reporter to detect OOM events and alert service owners, improving portability across multiple operating systems and Kubernetes distributions through inner-sourcing',
                'Built a scheduled Jenkins cron job to automatically clean up deprecated Docker images, reducing KTLO and optimizing resource management',
                'Developed a robust retry and back-off mechanism to ensure reliable storage of Quality Control data during live microservice requests, significantly enhancing message reliability between Kafka and Cassandra during system outages',
                'Implemented a Python component (split-brain-detector) to detect and report discrepancies between peer clusters in replica sets, supporting system consistency and reliability'
            ]
        },
        {
            header: 'Bloomberg L.P.', subHeader: 'Intern', dates: '06/2020 - 08/2020', place: 'Princeton, NJ', descriptions: ['Deployed Kubernetes cluster to run a microservice pipeline',
                'Wrote a Golang client for a proprietary password vault service',
                'Built a Terraform (Infrastructure as Code) provider plugin for password management Developed a Continuous Integration/Continuous Deployment pipeline in Jenkins with automated test and release',
                'Significantly simplified deployment workflow that requires credentials']
        },
        {
            header: 'Incoo Tech Co., Ltd', subHeader: 'Intern', dates: '06/2019 - 08/2019', place: 'Beijing, China', descriptions: ['Utilized Distributed Credit Chain to trace advertisements',
                'Built smart contracts on Remix for Ethereum blockchain',
                'Archived account and transaction data using Golang and MySQL']
        },
        {
            header: 'High Level Edu. Tech. Co., Ltd', subHeader: 'Intern', dates: '10/2018 - 06/2019', place: 'Beijing, China', descriptions: ['Developed computer aided instruction software for introducing AI and Python to high school students',
                'Built a Python web crawler using Selenium module with MySQL database',
                'Designed Python drawing and game examples',
                'Maintained company website']
        },
        {
            header: 'Center of Computer Architecture, BUPT', subHeader: 'Research Assistant', dates: '09/2017 - 06/2019', place: 'Beijing, China', descriptions: ['Utilized the Ant Colony Optimization (ACO) to tackle TSP problem, probe space storage characteristics in different algorithms to put forward the possibility of sparse memory',
                'Defined the ACS sparse rate, optimized it through sparse matrix COO and promote its application',
                'Published 1 patent. CN108596326A: A Sparse Ant System and Solution Method for Large Scale']
        },
    ],
    project: [
        {
            header: 'Software Engineering (Ruby on Rails)', subHeader: 'Administrative interface of on-campus commute solution for handicap students', dates: '09/2019 - 12/2019', place: 'College Station, TX', descriptions: ['Utilized JavaScript plug-in FullCalendar to achieve CRUD of recurring schedule for drivers by Ajax',
                'Followed BDD/TDD process during developing',
                'Deployed the project on heroku (PaaS)']
        },
        {
            header: 'Network Programming Technology (Python on Django)', subHeader: 'Online Q&A System', dates: '09/2017 - 12/2017', place: 'Beijing, China', descriptions: ['Completed the front-end and back-end of a website, and deployed on local network IP address.',
                'At front-end: HTTP, used the CSS for display style design, the JS and AJAX for dynamic display',
                'At back-end: MySQL database and Django framework of python to realize desired functions']
        },
        {
            header: 'Object-oriented Programming (C++)', subHeader: 'Game based on Socket Communication Client Server Mode', dates: '03/2017 - 06/2017', place: 'Beijing, China', descriptions: ['Independently developed and tested the game',
                'Achieved functions of online player s battle based on socket communication']
        },
    ]
};


const DescriptionEntryBuilder = (entries) => (
    entries.map(entry =>
        <Description>{entry}</Description>
    )
);


const ResumeEntry = ({ header = '', subHeader = '', dates = '', place = '', descriptions = [] }) => (
    <ResumeEntryWrapper>
        <HeaderWrapper>
            <Header>{header}</Header>
            <Dates>{dates}</Dates>
        </HeaderWrapper>
        <HeaderWrapper>
            <SubHeader>{subHeader}</SubHeader>
            <SubHeader>{place}</SubHeader>
        </HeaderWrapper>
        {DescriptionEntryBuilder(descriptions)}
    </ResumeEntryWrapper>
);




const resumeEntryBuilder = (entries) => (
    entries.map(entry =>
        <ResumeEntry
            header={entry.header}
            subHeader={entry.subHeader}
            dates={entry.dates}
            place={entry.place}
            descriptions={entry.descriptions} />
    )
)

export const Resume = () => (
    <ResumeWrapper>
        <NavBar />
        <MainContent>
            <SectionTitle>WORK</SectionTitle>
            {resumeEntryBuilder(resumeObject.work)}
            <SectionTitle>EDUCATION</SectionTitle>
            {resumeEntryBuilder(resumeObject.education)}
            <SectionTitle>PROJECT</SectionTitle>
            {resumeEntryBuilder(resumeObject.project)}
        </MainContent>
    </ResumeWrapper>
);