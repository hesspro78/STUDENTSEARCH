
export const findSimilarProfiles = (currentStudent, allStudents, count = 3) => {
    const similar = allStudents
        .filter(s => s.id !== currentStudent.id)
        .map(otherStudent => {
            let similarityScore = 0;
            if (otherStudent.domain === currentStudent.domain) similarityScore += 3;
            if (otherStudent.level === currentStudent.level) similarityScore += 2;
            
            const currentSpecWords = new Set(currentStudent.specialization.toLowerCase().split(' '));
            const otherSpecWords = new Set(otherStudent.specialization.toLowerCase().split(' '));
            const intersection = new Set([...currentSpecWords].filter(x => otherSpecWords.has(x)));
            similarityScore += intersection.size;

            if (otherStudent.source === 'linkedin') similarityScore += 2;
            if (otherStudent.contactStatus === 'verified') similarityScore += 3;
            if (otherStudent.contactStatus === 'uncertain') similarityScore += 1;

            return { ...otherStudent, similarityScore };
        })
        .filter(s => s.similarityScore > 2)
        .sort((a, b) => b.similarityScore - a.similarityScore);

    return similar.slice(0, count);
};
