const Report = require('../models/Report');
const Student = require('../models/Student');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require('./verifyToken');
const mongoose = require('mongoose');
const router = require('express').Router();

//ADD NEW REPORT per subject for each chapter
router.post('/add', verifyToken, async (req, res) => {
  const newReport = new Report({
    student_id: req.body.studentId,
    grade: req.body.grade,
    subject_id: req.body.subjectId,
    chapter_id: req.body.chapterId,
    score: req.body.score,
  });

  try {
    const savedReport = await newReport.save();
    return res.status(201).json(savedReport);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//UPDATE REPORT
router.put('/:id', verifyToken, async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(401).json('Report not found!');
  }

  try {
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedReport);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//DELETE
router.delete('/:id', verifyToken, async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(401).json('Report not found!');
  }

  try {
    await Report.findByIdAndDelete(req.params.id);
    return res.status(200).json('Report has been deleted...');
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET a Report for astudent
router.get('/find/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(401).json('Report not found!');
    }

    return res.status(200).json(report);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET ALL Reports
router.get('/', verifyToken, async (req, res) => {
  const query = req.query.new;
  try {
    const reports = query
      ? await Report.find().sort({ _id: -1 }).limit(5)
      : await Report.find();
    return res.status(200).json(reports);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET a Report for a student for all subjects
router.get('/find/:studentId/all', async (req, res) => {
  const findStudentId = mongoose.Types.ObjectId(req.params.studentId);
  try {
    const reports = await Report.aggregate([
      { $match: { student_id: findStudentId } },
      { $group: { _id: '$subject_id', avgScore: { $avg: '$score' } } },
    ]);

    if (!reports) {
      return res.status(401).json('Report not found!');
    }

    const newReports = reports.map((item) => {
      return {
        _id: item._id.toString(),
        avgScore: item.avgScore,
      };
    });

    const allReports = await Report.aggregate([
      { $group: { _id: '$subject_id', avgScore: { $avg: '$score' } } },
    ]);

    const newAllReports = allReports.map((item) => {
      return {
        _id: item._id.toString(),
        avgScore: item.avgScore,
      };
    });

    const merged = newReports.map((item) => {
      const arr = newAllReports.filter((rep) => {
        return rep._id === item._id;
      })[0];
      return {
        subject_id: item._id,
        avgPersonalScore: item.avgScore,
        avgGradeScore: arr.avgScore,
      };
    });
    return res.status(200).json(merged);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET a Report
router.get('/top', async (req, res) => {
  try {
    const test = await Report.aggregate([
      {
        $group: {
          _id: { student_id: '$student_id', grade: '$grade' },
          items: { $push: { score: '$score' } },
        },
      },
      {
        $project: {
          items: '$items',
        },
      },
      {
        $addFields: {
          average_score: {
            $divide: [
              {
                // expression returns total
                $reduce: {
                  input: '$items',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.score'] },
                },
              },
              {
                // expression returns score count
                $cond: [
                  { $ne: [{ $size: '$items' }, 0] },
                  { $size: '$items' },
                  1,
                ],
              },
            ],
          },
        },
      },
      { $sort: { average_score: -1 } },
    ]);

    // console.log(reportsByStudentId);
    // console.log(test);
    // const topReports = await Report.aggregate([
    //   { $sort: { grade: 1, score: -1 } },
    // ]);

    // function groupBy(xs, prop) {
    //   let grouped = {};
    //   for (let i = 0; i < xs.length; i++) {
    //     let p = xs[i][prop];
    //     if (!grouped[p]) {
    //       grouped[p] = [];
    //     }
    //     grouped[p].push(xs[i]);
    //   }
    //   return grouped;
    // }

    // let o = groupBy(topReports, 'grade');
    // console.log(o);

    // const keys = Object.keys(o);

    // const final = Object.values(o);

    // console.log(typeof final);
    return res.status(200).json(test);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//GET a Report
router.get('/list', async (req, res) => {
  try {
    const test = await Report.aggregate([
      {
        $group: {
          _id: { student_id: '$student_id', grade: '$grade' },
          items: { $push: { score: '$score' } },
        },
      },
      {
        $project: {
          items: '$items',
        },
      },
      {
        $addFields: {
          average_score: {
            $divide: [
              {
                // expression returns total
                $reduce: {
                  input: '$items',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.score'] },
                },
              },
              {
                // expression returns score count
                $cond: [
                  { $ne: [{ $size: '$items' }, 0] },
                  { $size: '$items' },
                  1,
                ],
              },
            ],
          },
        },
      },
      { $sort: { average_score: -1 } },
    ]);

    return res.status(200).json(test);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
