const { where } = require("sequelize");
const db = require("../../../models/index");
const { QueryTypes } = require("@sequelize/core");
const lms_course = db.lms_course;
const lms_course_content = db.lms_course_content;

exports.createCourse = async (req, res) => {
  try {
    const { category, course_name, course_type, thumbnail, contentData ,entity_id} =
      req.body;

    const course = await lms_course.create({
      course_name,
      category,
      course_type,
      thumbnail,
      entity_id
    });

    if (contentData && Array.isArray(contentData)) {
      const contentEntries = contentData.map((content) => ({
        course_id: course.id,
        content_name: content.content_name,
        content_file_path: content.content_file_path,
        content_file_type: content.content_file_type,
        content_file_link: content.content_file_link,
      }));

      await lms_course_content.bulkCreate(contentEntries);
    } else {
      return res.status(400).send({
        code: 400,
        message: "No content data provided.",
      });
    }

    res.status(201).send({
      code: 201,
      message: "Course and content created successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.createCourseWithAssessment = async (req, res) => {
  const transaction = await db.lms_course.sequelize.transaction();

  try {
    const {
      course_name,
      thumbnail,
      category,
      course_type,
      contentData,
      assesment,
      entity_id
    } = req.body;

    const course = await db.lms_course.create(
      {
        course_name,
        thumbnail,
        category,
        course_type,
        entity_id
      },
      { transaction }
    );

    if (contentData && Array.isArray(contentData)) {
      for (const content of contentData) {
        await db.lms_course_content.create(
          {
            course_id: course.id,
            content_name: content.content_name,
            content_file_path: content.content_file_path,
            content_file_type: content.content_file_type,
            content_file_link: content.content_file_link,
          },
          { transaction }
        );
      }
    }

    if (assesment) {
      const assessment = await db.lms_course_assessment.create(
        {
          course_id: course.id,
          assessment_name: assesment.assessment_name,
          total_marks: assesment.assessment_marks,
          pass_percentage: assesment.assessment_percentage,
          assessment_time_minutes: assesment.assessment_time,
          max_attempts: assesment.max_attempts,
        },
        { transaction }
      );

      if (assesment.questions && Array.isArray(assesment.questions)) {
        for (const question of assesment.questions) {
          await db.lms_course_question.create(
            {
              assessment_id: assessment.id,
              question_text: question.question_text,
              options: question.options,
              correct_answer: question.correct_answer,
              status: question.status || "ACTIVE",
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    res.status(201).json({
      code: 201,
      message:
        "Course assessment created successfully with associated content and questions.",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Error creating course with details.",
      error: error.message,
    });
  }
};

exports.courseList = async (req, res) => {
  try {
    
    const whereCondition = {};
    if (req.body.category) {
      whereCondition.category = req.body.category;
    }
    if (req.body.course_type) {
      whereCondition.course_type = req.body.course_type;
    }
    if (req.body.status) {
      whereCondition.status = req.body.status;
    }
    if(req.body.course_name){
      whereCondition.course_name = req.body.course_name
    }
    if(req.body.entity_id){
      whereCondition.entity_id = req.body.entity_id
    }

    const courseList = await db.lms_course.findAll({
      where: whereCondition,
      attributes: ['id', 'course_name', 'category',"course_type"],
    });

    res.status(200).json({
      message: "Course details fetched successfully.",
      data: courseList,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "Error fetching course list.",
    });
    throw error;
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const courseId = parseInt(req.params.course_id);
    const courseDetails = await db.lms_course.findOne({
      where: {
        id: courseId,
        isDeleted: false,
      },
      include: [
        {
          model: db.lms_course_content,
          as: "contentData",
          where: { isDeleted: false },
          required: false,
        },
        {
          model: db.lms_course_assessment,
          as: "assesments",
          where: { isDeleted: false },
          required: false,
          include: [
            {
              model: db.lms_course_question,
              as: "questions",
              where: { isDeleted: false },
              required: false,
            },
          ],
        },
      ],
    });

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json({
      message: "Course details fetched successfully.",
      data: courseDetails,
    });
  } catch (error) {
    console.error("Error in getCourseDetails:", error);
    res.status(500).json({
      message: "Error fetching course details.",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await db.lms_course.findAll({
      where: {
        isDeleted: false,
        entity_id : req.query.entity_id
      },
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM LMS_COURSE_CONTENT AS content
                WHERE content.course_id = LMS_COURSE.id AND content.isDeleted = false
              )`),
            "contentCount",
          ],

          [
            db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM LMS_COURSE_ASSESSMENT AS assessment
                WHERE assessment.course_id = LMS_COURSE.id AND assessment.isDeleted = false
              )`),
            "assessmentCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "No courses found.",
      });
    }

    res.status(200).json({
      message: "Courses fetched successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    res.status(500).json({
      message: "Error fetching courses.",
      error: error.message,
    });
  }
};
exports.getCommonCourses = async (req, res) => {
  try {
    const entity_id = req.query.entity_id;
    const courses = await db.lms_course.findAll({
      where: {
        isDeleted: false,
        course_type : "CommonContent",
        entity_id
      },
      attributes: {
        include: [
          [
            db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM LMS_COURSE_CONTENT AS content
                WHERE content.course_id = LMS_COURSE.id AND content.isDeleted = false
              )`),
            "contentCount",
          ],

          [
            db.sequelize.literal(`(
                SELECT COUNT(*)
                FROM LMS_COURSE_ASSESSMENT AS assessment
                WHERE assessment.course_id = LMS_COURSE.id AND assessment.isDeleted = false
              )`),
            "assessmentCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        message: "No courses found.",
      });
    }

    res.status(200).json({
      message: "Courses fetched successfully.",
      data: courses,
    });
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    res.status(500).json({
      message: "Error fetching courses.",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course_id = parseInt(req.params.course_id);
    const dltStage = await lms_course.findOne({
      where: { id: course_id },
    });
    if (dltStage) {
      const deleteData = await lms_course.update(
        { isDeleted: true },
        { where: { id: course_id } }
      );
      return res.status(200).send({
        code: 200,
        message: "Data is Deleted Successfully!",
        data: deleteData,
      });
    } else {
      return res.status(403).send({ code: 403, message: "Record Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ code: 500, message: "Server Error" });
  }
};

exports.updateCourseWithAssessment = async (req, res) => {
  const transaction = await db.lms_course.sequelize.transaction();

  try {
    const courseId = parseInt(req.params.course_id);
    const {
      course_name,
      thumbnail,
      category,
      course_type,
      contentData,
      assesment,
    } = req.body;

    const course = await db.lms_course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update(
      {
        course_name,
        thumbnail,
        category,
        course_type,
      },
      { transaction }
    );

    if (contentData && Array.isArray(contentData)) {
      await db.lms_course_content.destroy({
        where: { course_id: courseId },
        transaction,
      });

      for (const content of contentData) {
        await db.lms_course_content.create(
          {
            course_id: courseId,
            content_name: content.content_name,
            content_file_path: content.content_file_path,
            content_file_type: content.content_file_type,
            content_file_link: content.content_file_link,
          },
          { transaction }
        );
      }
    }

    if (assesment) {
      const assessment = await db.lms_course_assessment.findOne({
        where: { course_id: courseId },
      });

      if (!assessment) {
        await db.lms_course_assessment.create(
          {
            course_id: courseId,
            assessment_name: assesment.assessment_name,
            total_marks: assesment.assessment_marks,
            pass_percentage: assesment.assessment_percentage,
            assessment_time_minutes: assesment.assessment_time,
            max_attempts: assesment.max_attempts,
          },
          { transaction }
        );
      } else {
        await assessment.update(
          {
            assessment_name: assesment.assessment_name,
            total_marks: assesment.assessment_marks,
            pass_percentage: assesment.assessment_percentage,
            assessment_time_minutes: assesment.assessment_time,
            max_attempts: assesment.max_attempts,
          },
          { transaction }
        );
      }

      if (assesment.questions && Array.isArray(assesment.questions)) {
        await db.lms_course_question.destroy({
          where: { assessment_id: assessment.id },
          transaction,
        });

        for (const question of assesment.questions) {
          await db.lms_course_question.create(
            {
              assessment_id: assessment.id,
              question_text: question.question_text,
              options: question.options,
              correct_answer: question.correct_answer,
              status: question.status || "ACTIVE",
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message:
        "Course updated successfully with associated content, assessment, and questions.",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: "Error updating course with details.",
      error: error.message,
    });
  }
};

exports.updateCourseWithContent = async (req, res) => {
  const transaction = await db.lms_course.sequelize.transaction();

  try {
    const courseId = parseInt(req.params.course_id);
    const { course_name, thumbnail, category, course_type, contentData } =
      req.body;

    const course = await db.lms_course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.update(
      {
        course_name,
        thumbnail,
        category,
        course_type,
      },
      { transaction }
    );

    if (contentData && Array.isArray(contentData)) {
      await db.lms_course_content.destroy({
        where: { course_id: courseId },
        transaction,
      });

      for (const content of contentData) {
        await db.lms_course_content.create(
          {
            course_id: courseId,
            content_name: content.content_name,
            content_file_path: content.content_file_path,
            content_file_type: content.content_file_type,
            content_file_link: content.content_file_link,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.status(200).json({
      message:
        "Course updated successfully with associated content, assessment, and questions.",
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({
      message: "Error updating course with details.",
      error: error.message,
    });
  }
};

exports.allocateCourse = async (req, res) => {
  try {
    const {type,startDate,endDate,course_id,category,department,designation,employe,entity_id} = req.body;

    const commonFields = { startDate, endDate, course_id, category, type ,entity_id};
    const courseAllocation = await db.lms_assign_course.create(commonFields);

    if (type === "designation" && Array.isArray(designation)) {
      const designationRecords = designation.map((designation_id) => ({
        assign_id: courseAllocation.id,
        designation_id,
        entity_id
      }));
      await db.lms_assign_designation.bulkCreate(designationRecords);
    } else if (type === "department" && Array.isArray(department)) {
      const departmentRecords = department.map((department_id) => ({
        assign_id: courseAllocation.id,
        department_id,
        entity_id
      }));
      await db.lms_assign_department.bulkCreate(departmentRecords);
    } else if (type === "employe" && Array.isArray(employe)) {
      const employeeRecords = employe.map((emp) => ({
        assign_id: courseAllocation.id,
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        employee_code: emp.employee_code,
        designation: emp.designation,
        entity_id
      }));
      await db.lms_assign_employe.bulkCreate(employeeRecords);
    }

    res.status(201).send({
      code: 201,
      message: "Course allocation created successfully.",
      data: courseAllocation,
    });
  } catch (error) {
    console.error("Error in allocateCourse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};


exports.getAllAllocationsList = async (req, res) => {
  try {
    let data = [];

    const assign_course_all = await db.lms_assign_course.findAll({
      where: { isDeleted: false ,entity_id : req.query.entity_id},
    });
    assign_course_all.forEach((item) => {
      if (item) {
        data.push({
          course_id: item.course_id,
          assign_id: item.id,
          allocation_start_date: item.startDate,
          allocation_end_date: item.endDate,
          category: item.category,
          type : item.type,
          status : item.status,
        });
      }
    });

    if (data.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No courses found",
      });
    }
console.log(data ,"data log")
    const mergedResponse = await Promise.all(
      data.map(async (allocation) => {
        const courseDetails = await getCourseDetail(allocation.course_id);
        return {
          assign_id: allocation.assign_id,
          course_id: allocation.course_id,
          course_name: courseDetails.course_name || "",
          course_type: courseDetails.course_type,
          thumbnail: courseDetails.thumbnail,
          content_count: courseDetails.content_count,
          type : allocation.type,
          status : allocation.status,
          category: allocation.category,
          allocation_start_date: allocation.allocation_start_date,
          allocation_end_date: allocation.allocation_end_date,
        };
      })
    );

    return res.status(200).send({
      code: 200,
      message: "Courses fetched successfully.",
      data: mergedResponse,
    });
  } catch (error) {
    console.error("Error in getAllAllocationsList:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

exports.getAllAllocationsByEmployeeId = async (req, res) => {
  try {
    const { department_id, designation_id, employee_id ,entity_id} = req.body;
    let data = [];

    const assign_course_all = await db.lms_assign_course.findAll({
      where: { type: "all" , entity_id },
    });
    assign_course_all.forEach((item) => {
      if (item) {
        data.push({
          course_id: item.course_id,
          assign_id: item.id,
          allocation_start_date: item.startDate,
          allocation_end_date: item.endDate,
          category: item.category,
        });
      }
    });

    if (department_id) {
      const departmentCourses = await db.lms_assign_department.findAll({
        where: { department_id },
        include: [
          {
            model: db.lms_assign_course,
            required: true,
          },
        ],
      });
      departmentCourses.forEach((item) => {
        if (item.LMS_ASSIGN_COURSE) {
          data.push({
            course_id: item.LMS_ASSIGN_COURSE.course_id,
            assign_id: item.LMS_ASSIGN_COURSE.id,
            allocation_start_date: item.LMS_ASSIGN_COURSE.startDate,
            allocation_end_date: item.LMS_ASSIGN_COURSE.endDate,
            category: item.LMS_ASSIGN_COURSE.category,
          });
        }
      });
    }

    if (designation_id) {
      const designationCourses = await db.lms_assign_designation.findAll({
        where: { designation_id },
        include: [
          {
            model: db.lms_assign_course,
            required: true,
          },
        ],
      });
      designationCourses.forEach((item) => {
        if (item.LMS_ASSIGN_COURSE) {
          data.push({
            course_id: item.LMS_ASSIGN_COURSE.course_id,
            assign_id: item.LMS_ASSIGN_COURSE.id,
            allocation_start_date: item.LMS_ASSIGN_COURSE.startDate,
            allocation_end_date: item.LMS_ASSIGN_COURSE.endDate,
            category: item.LMS_ASSIGN_COURSE.category,
          });
        }
      });
    }

    if (employee_id) {
      const employeeCourses = await db.lms_assign_employe.findAll({
        where: { employee_id },
        include: [
          {
            model: db.lms_assign_course,
            required: true,
          },
        ],
      });
      employeeCourses.forEach((item) => {
        if (item.LMS_ASSIGN_COURSE) {
          data.push({
            course_id: item.LMS_ASSIGN_COURSE.course_id,
            assign_id: item.LMS_ASSIGN_COURSE.id,
            allocation_start_date: item.LMS_ASSIGN_COURSE.startDate,
            allocation_end_date: item.LMS_ASSIGN_COURSE.endDate,
            category: item.LMS_ASSIGN_COURSE.category,
          });
        }
      });
    }

    if (data.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No courses found for the provided filters",
        data: [],
      });
    }

    const mergedResponse = await Promise.all(
      data.map(async (allocation) => {
        const courseDetails = await getCourseDetail(allocation.course_id);
        return {
          assign_id: allocation.assign_id,
          course_id: allocation.course_id,
          course_name: courseDetails.course_name
            ? courseDetails.course_name
            : "",
          course_type: courseDetails.course_type,
          thumbnail: courseDetails.thumbnail,
          content_count: courseDetails.content_count,
          category: allocation.category,
          allocation_start_date: allocation.allocation_start_date,
          allocation_end_date: allocation.allocation_end_date,
        };
      })
    );
    const currentDate = new Date();
    const filteredResponse = mergedResponse.filter((course) => {
      const allocationEndDate = new Date(course.allocation_end_date);
      const currentDateOnly = new Date();
      
      // Resetting time part to 00:00:00 for both dates
      allocationEndDate.setHours(0, 0, 0, 0);
      currentDateOnly.setHours(0, 0, 0, 0);
    
      return allocationEndDate >= currentDateOnly;
    });
    return res.status(200).send({
      code: 200,
      message: "Courses fetched successfully.",
      data: filteredResponse,
    });
  } catch (error) {
    console.error("Error in getAllAllocations:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Internal Server Error",
    });
  }
};

// exports.getAllAllocationsByEmployeeId = async (req, res) => {
//   try {
//     const { department_id, designation_id, employee_id, entity_id } = req.body;
//     let data = [];

//     const coursesByEntity = await db.lms_assign_course.findAll({
//       where: { entity_id },
//       include: [
//         {
//           model: db.lms_assign_department,
//           required: false,
//           where: department_id ? { department_id } : {},
//         },
//         {
//           model: db.lms_assign_designation,
//           required: false,
//           where: designation_id ? { designation_id } : {},
//         },
//         {
//           model: db.lms_assign_employe,
//           required: false,
//           where: employee_id ? { employee_id } : {},
//         },
//       ],
//     });

//     coursesByEntity.forEach((course) => {
//       data.push({
//         course_id: course.course_id,
//         assign_id: course.id,
//         allocation_start_date: course.startDate,
//         allocation_end_date: course.endDate,
//         category: course.category,
//       });
//     });

//     if (data.length === 0) {
//       return res.status(404).send({
//         code: 404,
//         message: "No courses found for the provided filters",
//         data: [],
//       });
//     }

//     const mergedResponse = await Promise.all(
//       data.map(async (allocation) => {
//         const courseDetails = await getCourseDetail(allocation.course_id);
//         return {
//           assign_id: allocation.assign_id,
//           course_id: allocation.course_id,
//           course_name: courseDetails.course_name || "",
//           course_type: courseDetails.course_type,
//           thumbnail: courseDetails.thumbnail,
//           content_count: courseDetails.content_count,
//           category: allocation.category,
//           allocation_start_date: allocation.allocation_start_date,
//           allocation_end_date: allocation.allocation_end_date,
//         };
//       })
//     );

//     const currentDateOnly = new Date();
//     currentDateOnly.setHours(0, 0, 0, 0);
    
//     const filteredResponse = mergedResponse.filter((course) => {
//       const allocationEndDate = new Date(course.allocation_end_date);
//       allocationEndDate.setHours(0, 0, 0, 0);
//       return allocationEndDate >= currentDateOnly;
//     });

//     return res.status(200).send({
//       code: 200,
//       message: "Courses fetched successfully.",
//       data: filteredResponse,
//     });
//   } catch (error) {
//     console.error("Error in getAllAllocationsByEmployeeId:", error);
//     return res.status(500).send({
//       code: 500,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };

async function getCourseDetail(courseId) {
  try {
    const courseDetails = await db.sequelize.query(
      `
      SELECT 
        c.id AS course_id, 
        c.course_name, 
        c.category, 
        c.course_type, 
        c.thumbnail, 
        c.status,
        COUNT(cc.id) AS content_count
      FROM 
        LMS_COURSE c
      LEFT JOIN 
        LMS_COURSE_CONTENT cc
      ON 
        c.id = cc.course_id
      WHERE 
        c.id = ${courseId}
      `,
      {
        type: QueryTypes.SELECT,
        replacements: { courseId },
      }
    );

    return courseDetails[0];
  } catch (error) {
    console.error("Error in getCourseDetail:", error);
    throw error;
  }
}

exports.getAllocationById = async (req, res) => {
  const { assign_id, employee_id } = req.query;
  console.log(req.query, "quertt");

  try {
    const allocation = await db.lms_assign_course.findOne({
      where: { id: assign_id },
    });

    if (!allocation) {
      return res.status(404).send({
        code: 404,
        message: "Allocation not found.",
      });
    }

    const contentDetail = await getCourseContentDetail(
      allocation.course_id,
      employee_id
    );

    const submissionCount = contentDetail?.assesments?.[0]?.submissions?.length;
    const lastSubmissionStatus =
      contentDetail?.assesments?.[0]?.submissions?.[
        contentDetail.assesments[0].submissions.length - 1
      ]?.status;
    const left_attempts =
      contentDetail?.assesments?.[0]?.max_attempts - submissionCount;

    res.status(200).send({
      code: 200,
      message: "Allocation fetched successfully.",
      data: {
        allocation,
        courseDetaile: contentDetail,
        submissionCount: submissionCount,
        left_attempts: left_attempts,
        lastSubmissionStatus: lastSubmissionStatus,
      },
    });
  } catch (error) {
    console.error("Error in getAllocationById:", error);
    res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

async function getCourseContentDetail(courseId, employee_id) {
  try {
    const courseDetails = await db.lms_course.findOne({
      where: {
        id: courseId,
        isDeleted: false,
      },
      include: [
        {
          model: db.lms_course_content,
          as: "contentData",
          where: { isDeleted: false },
          required: false,
        },
        {
          model: db.lms_course_assessment,
          as: "assesments",
          where: { isDeleted: false },
          required: false,
          include: [
            {
              model: db.lms_submit_assessment,
              as: "submissions",
              where: { employee_id: employee_id },
              required: false,
              separate: true,
              order : [["id", "ASC"]],
            },
          ],
        },
      ],
    });

    return courseDetails;
  } catch (error) {
    console.error("Error fetching course details:", error);
    throw error; 
  }
}


exports.getAssessmentDetailById = async (req, res) => {
  try {
    const { assessment_id, emp_id } = req.query;
    console.log(assessment_id, "iddd");

    const assessmentDetails = await db.lms_course_assessment.findOne({
      where: {
        id: assessment_id,
        isDeleted: false,
      },
      include: [
        {
          model: db.lms_course_question,
          as: "questions",
          where: { isDeleted: false },
          required: false,
        },
      ],
    });

    if (!assessmentDetails) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    res.status(200).json({
      message: "Course details fetched successfully.",
      data: assessmentDetails,
    });
  } catch (error) {
    console.error("Error in getCourseDetails:", error);
    res.status(500).json({
      message: "Error fetching course details.",
      error: error.message,
    });
  }
};

exports.submitAssessment = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { employee_id, assessment_id, assign_id, answers } = req.body;

    const assessment = await db.lms_course_assessment.findByPk(assessment_id);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const attempts = await db.lms_submit_assessment.count({
      where: { employee_id },
      include: [
        {
          model: db.lms_course_assessment,
          as: "assessment",
          where: { id: assessment_id },
        },
      ],
    });
    if (attempts >= assessment.max_attempts) {
      return res.status(400).json({ message: "Max attempts exceeded" });
    }

    let obtainedMarks = 0;

    const submission = await db.lms_submit_assessment.create(
      {
        employee_id,
        assign_id,
        assesment_id: assessment_id,
        total_marks: assessment.total_marks,
        obtained_marks: 0,
        status: "PENDING",
      },
      { transaction }
    );

    for (const answer of answers) {
      const question = await db.lms_course_question.findByPk(
        answer.question_id
      );
      if (!question) continue;

      const isCorrect =
        question.correct_answer &&
        question.correct_answer === answer.selected_option;

      if (isCorrect) {
        const marksPerQuestion = assessment.total_marks / answers.length;
        obtainedMarks += marksPerQuestion;
      }

      await db.lms_question_attempt.create(
        {
          submission_id: submission.id,
          question_id: answer.question_id,
          is_correct: true,
          employee_answer: answer.selected_option,
        },
        { transaction }
      );
    }

    const passPercentage = (obtainedMarks / assessment.total_marks) * 100;
    const status =
      passPercentage >= assessment.pass_percentage ? "PASS" : "FAIL";

    await submission.update(
      { obtained_marks: obtainedMarks, status },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Assessment submitted successfully",
      data: { obtainedMarks, totalMarks: assessment.total_marks, status },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error in submitAssessment:", error);
    res.status(500).json({ message: "Error submitting assessment", error });
  }
};

exports.getSubmitAssessmnetDetail = async (req, res) => {
  try {
    const emp_id = req.query.employee_id;
    const detailData = await db.lms_submit_assessment.findOne({
      where: { employee_id: emp_id },
    });
    res.status(200).json({
      code: 200,
      status: "success",
      data: detailData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Error in Fetch Data ",
    });
  }
};

exports.getAssignedCourseById = async (req, res) => {
  try {
    const id = parseInt(req.params.assign_id);

    // Fetch the assigned course by ID
    const assignedCourse = await db.lms_assign_course.findOne({
      where: { id },
      include: [
        {
          model: db.lms_assign_designation,
          attributes: ["designation_id"],
        },
        {
          model: db.lms_assign_department,
          attributes: ["department_id"],
        },
        {
          model: db.lms_assign_employe,
          attributes: ["employee_id","employee_code","employee_name","designation"],
        },
      ],
    });

    if (!assignedCourse) {
      return res.status(404).send({
        code: 404,
        message: "Assigned course not found.",
      });
    }

    res.status(200).send({
      code: 200,
      message: "Assigned course retrieved successfully.",
      data: assignedCourse,
    });
  } catch (error) {
    console.error("Error in getAssignedCourseById:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.updateAssignedCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.assign_id);
    const {
      type,
      startDate,
      endDate,
      course_id,
      category,
      department,
      designation,
      employe,
      entity_id
    } = req.body;

    const assignedCourse = await db.lms_assign_course.findOne({
      where: { id },
    });
    if (!assignedCourse) {
      return res.status(404).send({
        code: 404,
        message: "Assigned course not found.",
      });
    }

    await assignedCourse.update({
      startDate,
      endDate,
      course_id,
      category,
      type,
      entity_id
    });

    if (type === "designation") {
      await db.lms_assign_designation.destroy({ where: { assign_id: id } });
      if (Array.isArray(designation)) {
        const designationRecords = designation.map((designation_id) => ({
          assign_id: id,
          designation_id,
          entity_id
        }));
        await db.lms_assign_designation.bulkCreate(designationRecords);
      }
    } else if (type === "department") {
      await db.lms_assign_department.destroy({ where: { assign_id: id } });
      if (Array.isArray(department)) {
        const departmentRecords = department.map((department_id) => ({
          assign_id: id,
          department_id,
          entity_id
        }));
        await db.lms_assign_department.bulkCreate(departmentRecords);
      }
    } else if (type === "employe") {
      await db.lms_assign_employe.destroy({ where: { assign_id: id } });
      if (Array.isArray(employe)) {
        const employeeRecords = employe.map((emp) => ({
          assign_id: id,
          employee_id: emp.employee_id,
          employee_name: emp.employee_name,
          employee_code: emp.employee_code,
          designation: emp.designation,
          entity_id
        }));
        await db.lms_assign_employe.bulkCreate(employeeRecords);
      }
    }

    res.status(200).send({
      code: 200,
      message: "Assigned course updated successfully.",
      data: assignedCourse,
    });
  } catch (error) {
    console.error("Error in updateAssignedCourse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.deleteAssignedCourse = async (req, res) => {
  try {
    const id = parseInt(req.params.assign_id);

    const assignedCourse = await db.lms_assign_course.findOne({
      where: { id },
    });

    if (!assignedCourse) {
      return res.status(404).send({
        code: 404,
        message: "Assigned course not found.",
      });
    }

    await assignedCourse.update({ isDeleted: true });

    // Delete related data based on type
    await db.lms_assign_designation.destroy({ where: { assign_id: id } }); // Remove designations
    await db.lms_assign_department.destroy({ where: { assign_id: id } }); // Remove departments
    await db.lms_assign_employe.destroy({ where: { assign_id: id } }); // Remove employees

    res.status(200).send({
      code: 200,
      message: "Assigned course and related data deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteAssignedCourse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.getAssignCourseSubmissionDetails = async (req, res) => {
  try {
    const assign_id = parseInt(req.params.assign_id);
    const submissionData = await db.sequelize.query(
      `SELECT 
        employee_id,
        MAX(status) AS status,
        MAX(obtained_marks) AS obtained_marks,
        MAX(attempt_date) AS attempt_date,
        COUNT(*) AS no_of_attempts,
        MAX(status) AS status, 
        MAX(attempt_date) AS last_attempt_date 
      FROM 
        LMS_ASSESSMENT_SUBMISSION
      WHERE 
        assign_id = :assign_id
      GROUP BY 
        employee_id`,
      {
        replacements: { assign_id },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );

    if (!submissionData.length) {
      return res
        .status(404)
        .json({ message: "No submissions found for the given assign_id" });
    }

    const employeeIds = [
      ...new Set(submissionData.map((submission) => submission.employee_id)),
    ];

    let employeeDetails = [];
    employeeDetails = await db.sequelize.query(
      `SELECT 
        u.employee_id,
        u.first_name AS employee_name,
        u.employee_code,
        d.designation_name AS designation_name,
        dp.department_name AS department_name
      FROM 
        HRMS_REGISTERED_USER AS u
      LEFT JOIN 
        DESIGNATION AS d ON u.designation_id = d.designation_id
      LEFT JOIN 
        MASTER_DEPARTMENT AS dp ON u.department_id = dp.dept_id
      WHERE 
        u.employee_id IN (:employeeIds)`,
      {
        replacements: { employeeIds },
        type: db.Sequelize.QueryTypes.SELECT,
      }
    );
    const assignedCourse = await db.lms_assign_course.findOne({
      where: { id: assign_id },
      include: [
        {
          model: db.lms_course,
          attributes: ["course_name"],
        },
      ],
    });

    const employeeMap = employeeDetails.reduce((acc, emp) => {
      acc[emp.employee_id] = emp;
      return acc;
    }, {});

    const formattedData = submissionData.reduce((acc, submission) => {
      const empDetails = employeeMap[submission.employee_id];
      if (!empDetails) return acc;
      const existingEntry = acc.find(
        (item) => item.employee_id === submission.employee_id
      );
      if (existingEntry) {
        existingEntry.no_of_attempts++;
      } else {
        acc.push({
          employee_id: submission.employee_id,
          course_id : assignedCourse.course_id,
          assign_id : assignedCourse.id,
          employee_name: empDetails.employee_name,
          employee_code: empDetails.employee_code,
          designation_name: empDetails.designation_name,
          department_name: empDetails.department_name,
          status: submission.status,
          attempt_date: submission.attempt_date,
          marks: submission.obtained_marks,
          no_of_attempts: submission.no_of_attempts,
        });
      }
      return acc;
    }, []);

    res.status(200).json({
      message: "Submission details fetched successfully",
      data: formattedData,
      assignedCourse: assignedCourse,
    });
  } catch (error) {
    console.error("Error in getAssignCourseSubmissionDetails:", error);
    res
      .status(500)
      .json({ message: "Error fetching submission details", error });
  }
};

exports.assignCourseSubmitAssessmentDetail = async (req, res) => {
  try {
    const { employee_id, assign_id, course_id } = req.body;

    const submittedData = await db.lms_submit_assessment.findAll({
      where: {
        employee_id: employee_id,
        assign_id: assign_id,
      },
      attributes: ["id","status"],
    });

    if (submittedData.length === 0) {
      return res.status(404).json({ message: "No submissions found" });
    }

    let allAttemptsData = [];
    for (let submission of submittedData) {
      const submissionId = submission.id;
      const submissionStatus = submission.status;
      const attemptsData = await db.lms_question_attempt.findAll({
        where: { submission_id: submissionId },
        attributes: ["id", "question_id", "employee_answer"],
        include: [
          {
            model: db.lms_course_question,
            attributes: ["id", "question_text", "question_type", "marks","correct_answer"],
            where: { isDeleted: false },
            required: false,
          },
        ],
      });
      
      allAttemptsData.push({
        submissionStatus: submissionStatus,
        attemptedQuestions: attemptsData,
      });
    }

    const assessmentData = await db.lms_course_assessment.findAll({
      where: { course_id },
      attributes: ["id", "assessment_name", "total_marks", "pass_percentage", "assessment_time_minutes", "max_attempts"],
    });

    
    const courseDetailsQuery = `
      SELECT LAS.startDate, LAS.endDate, LC.course_name, HRU.first_name
      FROM LMS_ASSIGN_COURSE AS LAS
      LEFT JOIN LMS_COURSE AS LC ON LC.id = LAS.course_id
      LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = :employee_id
      WHERE LAS.id = :assign_id
    `;

    const courseDetails = await db.sequelize.query(courseDetailsQuery, {
      type: db.Sequelize.QueryTypes.SELECT,
      replacements: { employee_id, assign_id },
    });

    res.status(200).json({
      data : {
      courseDetails: courseDetails[0],
      assessments: assessmentData,
      attempts: allAttemptsData
    }
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "An error occurred while fetching data" });
  }
};

//requested

exports.createRequestCourse = async (req, res) => {
  try {
    const { employee_id, course_id, remark } = req.body;
    const course = await db.lms_course.findOne({
      where: { id: course_id,isDeleted : false },
    });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const employee = await db.user.findOne({
      where: { employee_id },
      attributes: ["employee_id", "department_id"],
    });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const existingRequest = await db.lms_requested_course.findOne({
      where: { employee_id, course_id },
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Course already requested" });
    }
    const getData = await db.WorkFlow_Master.findOne({
      where: {
        department_id: employee.department_id,
        job_name: "LMS Course",
        status: "ACTIVE",
      },
      attributes: ["id"],
    });

    if (!getData) {
      return res.status(500).send({
        code: 500,
        message: "Workflow is not created for required department!",
      });
    }
    const newRequest = await db.lms_requested_course.create({
      employee_id,
      course_id,
      remark,
    });
    const get_levels = await db.Work_Flow_range.findAll({
      where: {
        workflow_id: getData.id,
        status: "ACTIVE",
      },
      attributes: ["level", "employee_id", "role_id", "workflow_id"],
    });

    const levelPromises = get_levels.map(async (level) => {
      const createdLevel = await db.lms_approval_course.create({
        level: level.level,
        employee_id: level.employee_id,
        workflow_id: level.workflow_id,
        lms_request_id: newRequest.id,
        role_id: level.role_id,
        department_id: employee.department_id,
      });
      return createdLevel;
    });

    await Promise.all(levelPromises);
    res.status(201).json({
      message: "Course requested successfully",
      data: newRequest,
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.listRequestedCourses = async (req, res) => {
  try {
    const { employee_id, course_id } = req.query;

    const whereCondition = {};
    if (employee_id) whereCondition.employee_id = employee_id;
    if (course_id) whereCondition.course_id = course_id;

    console.log("Where Condition:", whereCondition);

    const requestedCourses = await db.lms_requested_course.findAll({
      where: whereCondition,
      include: [
        {
          model: db.lms_course,
          attributes: [
            "course_name",
            "category",
            "thumbnail",
            [
              db.Sequelize.literal(
                `(SELECT COUNT(*) FROM LMS_COURSE_CONTENT 
                  WHERE LMS_COURSE_CONTENT.course_id = LMS_COURSE.id 
                  AND LMS_COURSE_CONTENT.isDeleted = false)`
              ),
              "contentCount",
            ],
            [
              db.Sequelize.literal(
                `(SELECT AC.startDate 
                  FROM LMS_REQUESTED_COURSE_ASSIGN AS RCA
                  LEFT JOIN LMS_ASSIGN_COURSE AS AC 
                  ON RCA.assign_id = AC.id
                  WHERE RCA.request_id = LMS_REQUESTED_COURSE.id
                )`
              ),
              "startDate",
            ],
            [
              db.Sequelize.literal(
                `(SELECT AC.endDate 
                  FROM LMS_REQUESTED_COURSE_ASSIGN AS RCA
                  LEFT JOIN LMS_ASSIGN_COURSE AS AC 
                  ON RCA.assign_id = AC.id
                  WHERE RCA.request_id = LMS_REQUESTED_COURSE.id
                )`
              ),
              "endDate",
            ],
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log("Requested Courses Query:", requestedCourses);

    if (requestedCourses.length > 0) {
      res.status(200).json({
        message: "Requested courses fetched successfully",
        data: requestedCourses,
      });
    } else {
      res.status(404).json({
        message: "No requested courses found.",
      });
    }
  } catch (error) {
    console.error("Error in listRequestedCourses:", error);
    return res.status(500).json({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};


exports.lms_approve_levels = async (req, res) => {
  try {
    const {
      approvel_status,
      progressStatus,
      employee_id,
      request_id,
      final_status,
      remark,
    } = req.body;

    const allLevelsData = await db.lms_approval_course.findAll({
      where: { employee_id, lms_request_id: request_id },
      order: [["level", "ASC"]],
    });
    if (!allLevelsData || allLevelsData.length === 0) {
      return res.status(404).send({
        code: 404,
        message: "No Level has been Assigned to this Employee!",
      });
    }
    const maxLevel = await db.lms_approval_course.max("level", {
      where: { lms_request_id: request_id },
    });
    const currentLevelData = await db.lms_approval_course.findOne({
      attributes: ["level"],
      where: { employee_id, lms_request_id: request_id },
    });
    const currentLevelValue = currentLevelData?.level;
    if (!currentLevelValue) {
      return res.status(404).send({
        code: 404,
        message: "Current level not found for the given employee",
      });
    }
    await db.lms_approval_course.update(
      { approvel_status, progressStatus, remark },
      { where: { employee_id, lms_request_id: request_id } }
    );
    if (approvel_status === "REJECTED") {
      await db.lms_approval_course.update(
        { approvel_status },
        { where: { lms_request_id: request_id, employee_id } }
      );
    }
    if (final_status === "REJECTED") {
      await db.lms_requested_course.update(
        { final_status: "REJECTED" },
        { where: { id: request_id } }
      );
    }

    const job_data = await db.lms_requested_course.findOne({
      where: {
        id: request_id,
      },
      attributes: ["employee_id"],
    });

    const nextLevelData = await db.lms_approval_course.findOne({
      where: {
        lms_request_id: request_id,
        level: currentLevelValue + 1,
      },
      attributes: ["employee_id"],
    });

    if (currentLevelValue === maxLevel) {
      await db.lms_requested_course.update(
        { final_status: approvel_status },
        { where: { id: request_id } }
      );

      return res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (approvel_status === "REJECTED") {
      return res.status(200).send({
        code: 200,
        message: "Final Approval Rejected Successfully!",
      });
    }
    return res.status(200).send({
      code: 200,
      message: "Updated Successfully!",
    });
  } catch (error) {
    console.error("Error in approve_levels:", error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_levels_to_be_approved = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const query = `              select
	                                   AC.lms_request_id as req_id,
                                     HRU.first_name,
                                     HRU.employee_code,
                                     LC.course_name,
                                     LC.category,
                                     RC.final_status,
                                     RC.course_id
                                   from
	                                   LMS_APPROVAL_COURSE as AC
                                left join LMS_REQUESTED_COURSE as RC on
	                                   RC.id = AC.lms_request_id 
                                left join HRMS_REGISTERED_USER as HRU on
	                                   HRU.employee_id = AC.employee_id
                                left join LMS_COURSE as LC on
	                                   LC.id = RC.course_id
                                left join MASTER_DEPARTMENT as MD on
	                                  MD.dept_id = AC.department_id 
                                    WHERE AC.employee_id =${employee_id}
                                    AND RC.status = 'ACTIVE' 
                                    AND RC.final_status = 'PENDING'
                                    AND NOT EXISTS (
                                                  SELECT *
                                    FROM LMS_APPROVAL_COURSE AS prev
                                    WHERE prev.lms_request_id = AC.lms_request_id 
                                    AND prev.level < AC.level
                                    AND prev.approvel_status != 'APPROVED'
                                               )
                                                      `;

    const getAllData = await db.sequelize.query(query, {
      replacements: { employeeId: employee_id },
      type: db.sequelize.QueryTypes.SELECT,
    });
    if (getAllData.length > 0) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Course Data Successfully",
        data: getAllData,
      });
    } else {
      return res.status(200).send({
        code: 200,
        message: "Record Not Found !",
        data: [],
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.get_Rejected_Approvals = async (req, res) => {
  try {
    const { employee_id } = req.body;
    let getAllData;
    const query = `
    SELECT  AC.lms_request_id as req_id,
                                     HRU.first_name,
                                     HRU.employee_code,
                                     LC.course_name,
                                     LC.category,
                                     RC.final_status,
                                     RC.course_id
    FROM LMS_APPROVAL_COURSE AS AC
    INNER JOIN LMS_REQUESTED_COURSE AS RC ON RC.id = AC.lms_request_id
    INNER JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RC.employee_id
    left join LMS_COURSE as LC on LC.id = RC.course_id
      WHERE AC.employee_id = '${employee_id}'
      AND AC.approvel_status = 'REJECTED'
      ORDER BY AC.id DESC;`;
    getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetch All Product Successfully",
        data: getAllData,
      });
    } else {
      return res
        .status(200)
        .send({ code: 200, message: "Record Not Found", data: [] });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ code: 500, message: error.message || "Server Error" });
  }
};

exports.get_Approved_Approvals = async (req, res) => {
  try {
    const { employee_id } = req.body;
    const query = `
    SELECT AC.lms_request_id as req_id,
           HRU.first_name,
           HRU.employee_code,
           LC.course_name,
           LC.category,
           RC.final_status,
           RC.course_id
    FROM LMS_APPROVAL_COURSE AS AC
    INNER JOIN LMS_REQUESTED_COURSE AS RC ON RC.id = AC.lms_request_id
    LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RC.employee_id
    left join LMS_COURSE as LC on LC.id = RC.course_id
      WHERE AC.employee_id = '${employee_id}'
      AND AC.approvel_status = 'APPROVED'
      ORDER BY AC.id DESC;
      `;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (getAllData) {
      return res.status(200).send({
        code: 200,
        message: "Fetched All Approved Approvals Susseccfully !",
        data: getAllData,
      });
    } else {
      return res.status(404).send({
        code: 404,
        message: "No Approved Approvals Found for This Employee !",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      code: 500,
      message: error.message || "Server Error",
    });
  }
};

exports.courseRequestDetail = async (req, res) => {
  try {
    const req_id = req.params.id;

    const reqdata = await db.lms_requested_course.findOne({
      where: { id: req_id },
    });

    if (!reqdata) {
      return res.status(404).json({
        success: false,
        message: "Requested course not found.",
      });
    }

    const employeData = await db.user.findOne({
      where: { employee_id: reqdata.employee_id },
      attributes: [
        "employee_id",
        "first_name",
        "employee_code",
        "department_id",
        "designation_id",
        // "approval_manager",
        // "approval_manager_id",
        "reporting_manager_id",
        "reporting_manager",
      ],
    });

    let designationData = null;
    let departmentData = null;

    if (employeData) {
      designationData = await db.designation.findOne({
        where: { designation_id: employeData.designation_id },
        attributes: ["designation_id", "designation_name"],
      });

      departmentData = await db.department.findOne({
        where: { dept_id: employeData.department_id },
        attributes: ["dept_id", "department_name"],
      });
    }

    const courseData = await db.lms_course.findOne({
      where: { id: reqdata.course_id,isDeleted : false },
      attributes: [
        "id", 
        "course_name", 
        "category", 
        "thumbnail",
        [db.Sequelize.literal(`(SELECT COUNT(*) FROM LMS_COURSE_CONTENT WHERE LMS_COURSE_CONTENT.course_id = LMS_COURSE.id AND LMS_COURSE_CONTENT.isDeleted = false)`), 'contentCount']
      ]
    });

    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course data not found.",
      });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      message: "Request details retrieved successfully.",
      data: {
        request: reqdata,
        employee: employeData || null,
        designation: designationData || null,
        department: departmentData || null,
        course: courseData,
      },
    });
  } catch (error) {
    console.error("Error in courseRequestDetail:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course request details.",
      error: error.message,
    });
  }
};

exports.requestedCourseAssign = async (req, res) => {
  try {
    const {
      course_id,
      request_id,
      allocate_by_id,
      startDate,
      endDate,
      category,
    } = req.body;

    const courseData = await db.lms_course.findOne({
      where: { id: course_id,isDeleted : false },
      attributes: ["id", "course_name"],
    });
    if (!courseData) {
      return res.status(404).json({
        success: false,
        message: "Course data not found.",
      });
    }

    const courseRequestData = await db.lms_requested_course.findOne({
      where: { id: request_id },
    });
    if (!courseRequestData) {
      return res.status(404).json({
        success: false,
        message: "Course request data not found.",
      });
    }

    const courseAllocation = await db.lms_assign_course.create({
      startDate,
      endDate,
      course_id,
      category,
      type: "employe",
    });
const employeeDetails = await db.user.findOne({
  where: { employee_id: courseRequestData.employee_id },
  attributes : ["first_name","employee_id","employee_code","designation_id"]
})
const designation_name = await db.designation.findOne({
  where: { designation_id: employeeDetails.designation_id },
  attributes : ["designation_name"],
})
    const employeeRecords = {
      assign_id: courseAllocation.id,
      employee_id: courseRequestData.employee_id,
      employee_code : employeeDetails.employee_code,
      employee_name: employeeDetails.first_name,
      designation: designation_name.designation_name,
    };
    await db.lms_assign_employe.create(employeeRecords);

    await db.lms_requested_course_assign.create({
      course_id,
      assign_id: courseAllocation.id,
      request_id,
      allocate_by_id,
      employee_id: courseRequestData.employee_id,
    });

    return res.status(200).json({
      success: true,
      message: "Course assigned successfully.",
    });
  } catch (error) {
    console.error("Error in requestedCourseAssign:", error);

    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error.",
        errors: error.errors.map((err) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.listRequestedCourseAssign = async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `
    SELECT 
    RAC.*,
    HRU.first_name,
    HRU.employee_code,
    HRU.employee_id,
    MD.designation_name,
    LC.course_name,
    LC.category
    FROM LMS_REQUESTED_COURSE_ASSIGN AS RAC
    LEFT JOIN LMS_REQUESTED_COURSE AS RC ON RC.id = RAC.request_id
    LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RC.employee_id
    LEFT JOIN DESIGNATION AS MD ON MD.designation_id = HRU.designation_id
    LEFT JOIN LMS_COURSE as LC on LC.id = RC.course_id
      WHERE RAC.allocate_by_id = '${user_id}';
      `;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      message: "Requested course assignments retrieved successfully.",
      data: getAllData,
    });
  } catch (error) {
    console.error("Error in listRequestedCourseAssign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
exports.requestedCourseList = async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `
    SELECT 
    AC.lms_request_id AS req_id,
    HRU.first_name,
    HRU.employee_code,
    LC.course_name,
    LC.category,
    RC.final_status,
    RC.course_id
FROM LMS_APPROVAL_COURSE AS AC
INNER JOIN LMS_REQUESTED_COURSE AS RC ON RC.id = AC.lms_request_id
LEFT JOIN LMS_REQUESTED_COURSE_ASSIGN AS RAC ON RAC.request_id = RC.id
LEFT JOIN HRMS_REGISTERED_USER AS HRU ON HRU.employee_id = RC.employee_id
LEFT JOIN LMS_COURSE AS LC ON LC.id = RC.course_id
WHERE AC.employee_id = '${user_id}'
  AND AC.approvel_status = 'APPROVED'
  AND RAC.request_id IS NULL
ORDER BY AC.id DESC;
      `;
    const getAllData = await db.sequelize.query(query, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({
      success: true,
      message: "Requested course assignments retrieved successfully.",
      data: getAllData,
    });
  } catch (error) {
    console.error("Error in listRequestedCourseAssign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
