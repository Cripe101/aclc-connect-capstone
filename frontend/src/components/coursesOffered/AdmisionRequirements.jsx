const AdmisionRequirements = () => {
  return (
    <div className="flex">
      <span className="bg-blue-50 p-5 rounded-lg">
        <h1 className="font-bold text-xl">Admision Requirements :</h1>
        <section className="mt-5">
          <h1 className="mb-2 font-bold">FRESHMEN</h1>
          <h1 className="grid gap-2">
            <p>1. Accomplished Application Form</p>
            <p>2. High School Report Card (Form 138)</p>
            <p>
              3. High School Transcript (Form 137a) Note: This should be a
              school to school transaction to ensure its authenticity
            </p>
            <p>4. Certificate of Good Moral Character</p>
            <p>5. 2x2 picture (for 201 file)</p>
            <p>6. 1x1 picture (for ID)</p>
          </h1>
        </section>
        <section className="mt-10">
          <h1 className="mb-2 font-bold">TRANSFEREES</h1>
          <h1 className="grid gap-2">
            <p>1. Accomplished Application Form</p>
            <p>2. Honorable Dismissal/ Transfer Credentials</p>
            <p>3. Certificate of Good Moral Character</p>
            <p>
              4. Temporary Transcript/ Certificate of Grades for evaluation
              purposes
            </p>
            <p>
              5. Official Transcript of Records to be sent by the previous
              school with a notation: COPY FOR: (ACLC CAMPUS WHERE YOU ENROLLED)
            </p>
            <p>6. Subject description taken from the previous school</p>
            <p>7. 2x2 picture (for 201 file)</p>
            <p>8. 1x1 picture (for ID)</p>
          </h1>
        </section>
      </span>
    </div>
  );
};

export default AdmisionRequirements;
