export interface CandidateFeedback {
    candidateName: string;
    dateOfInterview: Date;
    positionAppliedFor: number;
    interviewer: string;
    round?: number;
    educationalBackgroundRating: number;
    workExperienceRating: number;
    technicalSkillsRating: number;
    communicationSkillsRating: number;
    candidateInterestRating: number;
    interpersonalSkillsRating: number;
    overallRating: number;
    comments: string;
    result: string;
}