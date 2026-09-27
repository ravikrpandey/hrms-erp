const { jobs } = require("../../models/index");
const database =  require("../../models/index");
// const jobData = database.jobs



class JobsService {
    static async create(data) {
        try {
            return database.jobs.create(data);
        } catch (error) {
            throw error;
        }
    };

    static async updateByJobId(data, jobId) {
        try {
            return database.jobs.update(data, {
              where: {
                id: jobId
              },
              returning: true,
            });
          } catch (error) {
            console.log(error);
            throw error;
          }
    };

    static async findById(id) {
        try {
          return database.jobs.findByPk(id);
        } catch (error) {
          throw error;
        }
    }

    static async findOneByCond(cond) {
        try {
          return database.jobs.findOne({
            where: cond,
          });
        } catch (error) {
          throw error;
        }
    }


    static async findAllJobDetailsById() {
        try {
          return database.jobs.findAll({
            where: {
                is_deleted: false
            },
            include: [
                // {
                //     model: database.jobTitles,
                //     attributes: ['job_title'],
                // },
                {
                    model: database.jobTypes,
                    attributes: ['job_type'],
                },
                {
                    model: database.verticals,
                    attributes: ['vertical_name'],
                },
            ],
            raw: true,
          });
        } catch (error) {
          throw error;
        }
    }
}

module.exports = JobsService;