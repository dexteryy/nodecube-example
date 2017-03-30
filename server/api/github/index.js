
import { Router } from 'express';
import hifetch from 'hifetch';
import {
  errorTrigger,
  errorResponse,
} from 'nodecube';

const api = Router();

api.get('/users/:username', async function (req, res) {
  const {
    username,
  } = req.params;
  const fetchOrgs = hifetch({
    url: `https://api.github.com/users/${username}/orgs`,
    timeout: 8000,
  }).send();
  const fetchRepos = hifetch({
    url: `https://api.github.com/users/${username}/repos`,
    timeout: 8000,
  }).send();
  try {
    const [orgs, repos] = await Promise.all([
      fetchOrgs,
      fetchRepos,
    ]);
    if (!orgs || !repos) {
      errorTrigger({
        isExpected: false,
        status: -1,
        message: `INVALID RESULTS: ${username}`,
      });
    }
    if (orgs.length < 1) {
      errorTrigger({
        status: -2,
        message: `ZERO ORGS: ${username}`,
      });
    }
    if (repos.length < 1) {
      errorTrigger({
        status: -3,
        message: `ZERO REPOS: ${username}`,
      });
    }
    res.json({
      status: 0,
      data: {
        orgs,
        repos,
      },
    });
  } catch (err) {
    errorResponse(req, res)(err);
  }
});

export default api;
