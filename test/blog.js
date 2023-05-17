const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../routes/blog");

chai.should();

chai.use(chaiHttp);

// GET all blogs
describe("BLOG API", () => {
  describe("GET /blogs", () => {
    it("It should GET all the blogs", (done) => {
      chai
        .request(server)
        .get("/blogs")
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("json");
        });
      done();
    });
  });
});

// Get blog by id
describe("BLOG API", () => {
  describe("GET /singlepost/:blogid", () => {
    it("It should GET a blog", (done) => {
      const blogid = "6459eb824b7526b5485fbe32";
      chai
        .request(server)
        .get("/singlepost/" + blogid)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a("json");
        });
      done();
    });
  });
});

describe("BLOG API", () => {
  describe("POST /blogpost/:userid", () => {
    it("It should POST a blog", (done) => {
      const obj = {
        title: "testing final",
        context: "This is context",
      };
      const userId = "645a091da776c221d8336880";
      chai
        .request(server)
        .post("/blogpost/" + userId)
        .send(obj)
        .set(
          "Cookie",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NWEwOTFkYTc3NmMyMjFkODMzNjg4MCIsImlhdCI6MTY4NDIyNjUzNX0.qqeMN_Fn-zVs3srmQGl2YmnU80rJADktQ-EiLQlfq5Y"
        )
        .end((err, res) => {
          res.body.should.not.have(err);
          res.body.should.have.property("title");
          res.body.should.have.property("context");
          res.should.be.a("json");
        });
      done();
    });
  });
});
