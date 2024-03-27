const request = require('supertest');

host = 'http://localhost:5000'

describe('Resume API tests', () => {
  it('GET /db/resume/read?user_id=1 should return 200', async () => {
    const res = await request(host).get('/db/resume/read?user_id=1');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /db/resume/read should return 500: No parameters specified', async () => {
    const res = await request(host).get('/db/resume/read');
    expect(res.statusCode).toEqual(500);
  });

  it('POST /db/resume/create should return 415: No resume passed', async () => {
    const res = await request(host).post('/db/resume/create');
    expect(res.statusCode).toEqual(415);
  });

  it('POST /db/resume/create with invalid resume should return 500: Bad resume passed', async () => {
    const res = await request(host).post('/db/resume/create?user_id=1').send({})
    expect(res.statusCode).toEqual(500);
  });

  it('PUT /db/resume/update should return 500: No user or resume specified', async () => {
    const res = await request(host).put('/db/resume/update');
    expect(res.statusCode).toEqual(500);
  });

  it('DELETE /db/resume/delete should return 500: No user or resume specified', async () => {
    const res = await request(host).delete('/db/resume/delete');
    expect(res.statusCode).toEqual(500);
  });

  it('POST,PUT,DELETE: Full end-to-end', async () => {
    const post = await request(host).post('/db/resume/create?user_id=1').send({
        "title": "test resume",
        "user_id": 1,
        "sections": [
            {
                "entries": [
                    {
                        "bullets": [
                            {
                                "content": ""
                            }
                        ],
                        "title": ""
                    }
                ],
                "title": ""
            }
        ]
    });
    expect(post.statusCode).toEqual(200);
    expect(post.body.title).toEqual("test resume");

    var resume_id = post.body.resume_id
    const put = await request(host).put(`/db/resume/update?user_id=1&resume_id=${resume_id}`).send({
        "title": "test resume with new title",
        "user_id": 1,
        "sections": [
            {
                "entries": [
                    {
                        "bullets": [
                            {
                                "content": ""
                            }
                        ],
                        "title": ""
                    }
                ],
                "title": ""
            }
        ]
    });

    expect(put.statusCode).toEqual(200);
    expect(put.body.title).toEqual("test resume with new title")

    resume_id = put.body.resume_id
    const del = await request(host).delete(`/db/resume/delete?user_id=1&resume_id=${resume_id}`);
    expect(del.statusCode).toEqual(200);
  });

});

describe('Entry API tests', () => {
  it('POST,READ,PUT,DELETE: Full end-to-end', async () => {
    // Create test resume
    const resumePost = await request(host).post('/db/resume/create?user_id=1').send({
        "title": "test resume",
        "user_id": 1,
        "sections": []
    });

    expect(resumePost.statusCode).toEqual(200);
    var resume_id = resumePost.body.resume_id

    // Create test entry
    const entryPost = await request(host).post(`/db/entry/create?user_id=1&resume_id=${resume_id}`).send({
        "bullets": [],
        "title": "New entry"
    });
    expect(entryPost.statusCode).toEqual(200);
    expect(entryPost.body.title).toEqual("New entry");
    var entry_id = entryPost.body.entry_id;

    // Read that test entry
    const entryGet = await request(host).get(`/db/entry/read?entry_id=${entry_id}`)

    expect(entryGet.statusCode).toEqual(200);
    expect(entryGet.body.section_id).not.toBeNull();

    // Update that test entry
    const entryUpdate = await request(host).put(`/db/entry/update?entry_id=${entry_id}`).send({
        "bullets": [],
        "title": "New entry with new title"
    })

    expect(entryUpdate.statusCode).toEqual(200);
    entry_id = entryUpdate.body.entry_id  // entry_id gets updated after update
    expect(entry_id).not.toBeNull();
    expect(entryUpdate.body.title).toEqual("New entry with new title")

    // Delete the test entry
    const entryDel = await request(host).delete(`/db/entry/delete?entry_id=${entry_id}`);
    expect(entryDel.statusCode).toEqual(200);

    // Clean up, delete the resume
    const del = await request(host).delete(`/db/resume/delete?resume_id=${resume_id}`);
    expect(del.statusCode).toEqual(200);
  });
});