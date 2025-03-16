# NHS Jobs Scraper & AI Cover Letter Generator

### **NHS Jobs Scraper & AI Cover Letter Generator** 🚀

#### **What It Does**
- 🔍 **Scrapes NHS Job Listings** – Automatically fetches job postings from the NHS job portal.
- 📄 **Extracts Key Details** – Gathers job titles, descriptions, requirements, and locations.
- 📝 **Generates Personalized Cover Letters** – Uses AI to tailor cover letters based on job details and user input.

#### **Key Features**
- ✅ **Fast & Automated** – Saves time by eliminating manual job searching.
- ✅ **Custom-Tailored Letters** – AI adapts cover letters to highlight relevant skills.
- ✅ **Optimized for NHS Jobs** – Ensures ATS-friendly formatting and keywords.

🎯 **Ideal for job seekers looking to apply quickly and efficiently in the healthcare sector!**

The agent uses gpt-4o-mini model, and it expects a valid OPENAI API key to be set in the environment variable `OPENAI_API_KEY`.

## Input
The agent has two input:
- `url`: (required): The URL of the NHS job listings search page.
- `aboutMe`: (required): A brief description of the user's skills and experience to be included in the cover letter.

Note that this was developed as a part of Apify AI agents hackathon.

## Output
The agent returns a JSON object with the following structure:
```json
[
  {
    "job_url": "string",
    "cover_letter": "string",
  }
]
```

Example:
```json
[
  {
    "job_url": "https://www.jobs.nhs.uk/candidate/jobadvert/C9325-25-0181",
    "cover_letter": "Dear Olivia Southwell, I am writing to express my interest in the 8a Principal Clinical/Counselling Psychologist/Psychotherapist position at Surrey and Borders Partnership NHS Foundation Trust. With my Doctorate in Clinical Psychology and extensive experience working with personality disorders, I am well-prepared to contribute to your Psychologically Informed Consultation and Training Team. I have a solid background in providing training and consultation to multidisciplinary teams, which aligns with the duties of this role. I am particularly impressed by your commitment to enhancing the understanding of personality disorders and supporting clinicians across various sectors. I look forward to the opportunity to bring my skills in clinical supervision and co-production to your esteemed Trust. Thank you for considering my application. Sincerely, Abdelaziz"
  },
  {
    "job_url": "https://www.jobs.nhs.uk/candidate/jobadvert/C9290-25-0347",
    "cover_letter": "Dear Daniel Dennis, I am excited to apply for the Medical Education Service Manager position at Imperial College Healthcare NHS Trust. With my background in managing educational programs and a degree in management, I am eager to support the development of medical education across your Trust. My experience in leading teams and my familiarity with medical education matters make me a strong candidate for this role. I am particularly drawn to your commitment to career development and flexible working opportunities for staff. I am passionate about promoting high-quality training programs and would love to contribute to your team's success. Thank you for considering my application. Best regards, Abdelaziz"
  }
]


```


More job portals and features will be added soon (depending on demand and bandwidth). Stay tuned! 🚀
