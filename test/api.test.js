const request = require('supertest');

host = 'http://localhost:5000'

describe('API tests', () => {
  it('GET /db/resume/read?user_id=1 should return 200', async () => {
    const res = await request(host).get('/db/resume/read?user_id=1');
    expect(res.statusCode).toEqual(200);
  });

  it('GET /db/resume/read should return 500: No user specified', async () => {
    const res = await request(host).get('/db/resume/read');
    expect(res.statusCode).toEqual(500);
  });

  it('GET /db/resume/read?resume_id=3 should return 500: No user specified', async () => {
    const res = await request(host).get('/db/resume/read?resume_id=3');
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

    let resume_id = post.body.resume_id
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