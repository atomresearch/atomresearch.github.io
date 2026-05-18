---
slug: pinductor
title: "Learning POMDP World Models from Observations with Language-Model Priors"
date: "2026-05-16"
excerpt: "Why we believe that active world-model discovery - not larger imitation -is the missing piece on the road to general-purpose agents."
cover: "../assets/posts/pinductor/cover.png"
authors:
  - "ATOM"
tags:
  - "POMDP"
  - "Agents"
  - "World Models"
arxiv: "https://arxiv.org/pdf/2605.13740"
github: "https://github.com/atomresearch/pinductor"
relatedPaperIds:
  - 
bibtex: |
  @misc{six2026learningpomdpworldmodels,
        title={Learning POMDP World Models from Observations with Language-Model Priors}, 
        author={Valentin Six and Frederik Panse and Mathis Fajeau and Lancelot Da Costa and Mridul Sharma and Alfonso Amayuelas and Tim Z. Xiao and David Hyland and Philipp Hennig and Bernhard Schölkopf},
        year={2026},
        eprint={2605.13740},
        archivePrefix={arXiv},
        primaryClass={cs.LG},
        url={https://arxiv.org/abs/2605.13740}, 
  }
---

When you step into an unfamiliar building, you don't see the full floor plan - but you quickly build a mental model from what you glimpse around each corner. AI agents face the same challenge: how can they learn an internal model of the world from limited, partial observations, without someone handing them a map or revealing the hidden state behind the scenes?

In our latest work, we introduce **Pinductor** (POMDP-inductor), a method that induces executable world models from just a handful of observation-action trajectories.

## The Challenge: Partial Observability

Partially Observable Markov Decision Processes (POMDPs) are the standard mathematical framework for decision-making under uncertainty. A POMDP is defined by states $\mathcal{S}$, actions $\mathcal{A}$, observations $\mathcal{O}$, transition dynamics $T$, observation likelihoods $O$, and rewards $R$. Because the agent only sees observations $$o_t$$ and not the true latent state $s_t$, it must maintain a *belief* $Q$, i.e., a probability distribution over possible states. The classic Bayesian update looks like this:

$$Q'(s') \propto O(s', a, o) \sum_{s \in \mathcal{S}} T(s, a, s')\, Q(s)$$

Learning all these components from scratch is very difficult. Classical approaches need huge amounts of environment interaction. Recent LLM-based methods reduce interaction by using language models to write world-model code, but most assume you can see the hidden state during training or sneak hidden state during any other phase which is an unrealistic luxury when you consider real-world problems.

We asked a simple question: *Can LLM priors replace the need for hidden-state supervision?*

## The Idea: Generate, Evaluate, Refine

Pinductor treats the LLM as a program synthesizer. Given a brief natural-language description of the environment and a small offline dataset (as few as 10 trajectories), the LLM proposes Python code for the POMDP components: the transition model, observation model, reward function, and initial-state distribution.

The hard part is evaluation. Without access to the true hidden state, how do we score a candidate model?


## Belief-Based Scoring

Since we never see the true hidden state, we can't check whether the model's predicted states are "correct." Instead, we ask: *Does the model's internal story about the world predict the observations we actually received?*

Here's how it works. For each candidate model, Pinductor runs a particle filter:

1. **Sample** $$K$$ particles from the model's guess ($$\rho_0^m$$).
2. **Propagate** each particle forward through the model's transition code ($$T^m$$), using the real actions from the data.
3. **Predict** what observation each particle "should" see, using the LLM's observation program: $$o^i_{t+1} \sim O^m_{\text{LLM}}(s^i_{t+1}, a_t)$$.
4. **Compare** these predictions to the actual observations.

For MiniGrid, an observation is a tuple $$o = (g, \theta, c)$$: the visible grid patch, the agent's facing direction, and whatever object the agent is carrying. We measure how far a predicted observation is from the real one with a simple distance:

$$d_{\text{obs}}(o', o) = d_{\text{grid}}(g', g) + \lambda_{\text{dir}}\mathbf{1}[\theta' \neq \theta] + \lambda_{\text{carry}}\mathbf{1}[c' \neq c]$$

The LLM's observation code is usually deterministic - it outputs exactly one grid for a given state. But the real world is messy, and we want to give partial credit to near-misses. So we soften these hard predictions into probabilities using a kernel:

$$O^m(o_{t+1} \mid s^i_{t+1}, a_t) \propto \exp\left(-\frac{d_{\text{obs}}(o^i_{t+1},\, o_{t+1})}{\kappa}\right)$$

The resulting particle-filtered posterior belief is the distribution of propagated samples $s^i_{t+1}$ reweighted by their likelihood


$$ Q^m_{t+1}(s) \propto \sum^K_{i=1} O^m (o_{t+1}|s^i_{t+1}, a_t)\delta_{s^i_{t+1}}(s)$$

Particles that predict observations close to reality get high weight; particles that hallucinate something completely different get crushed. This reweighted set becomes the updated belief. The model's overall score is the total log-likelihood of the real data under its own filtering dynamics, computed entirely from observations and actions, with zero access to hidden states.

$$L(P^m ; D) = \sum_{\tau \in D} \sum^{H-1}_{t=0} E_{s_{t+1} \sim Q^m_{t+1}}[\log O^{m}(o_{t+1}| s^i_{t+1}, a_t) ] $$


## Feedback and Refinement
Scored candidates feed a refinement-by-execution (REx) loop: the LLM receives structured debugging feedback - execution errors, high-distance trajectory segments, and a committee-based disagreement signal highlighting uncertain transitions - and proposes targeted model repairs. Candidates are selected for refinement via UCB1, building a search tree over executable POMDP programs rather than a single chain of edits.


## Planning
The best model is then used for belief-space planning via an $A^*$-style POMDP planner, with the agent maintaining a particle belief updated by the same distance-kernel likelihood used during training. After each episode, newly collected trajectories are added to the dataset and a fresh REx round is triggered, keeping the model improving online.


## What We Found

We evaluate Pinductor on five MiniGrid tasks, from simple empty rooms to complex multi-step problems like unlocking a door with a key. Despite never seeing hidden states, Pinductor matches the sample efficiency and reward of the baselines that *does* have privileged hidden state access. It also far outperforms standard tabular baselines.

![Pinductor pipeline](../assets/posts/pinductor/e1_rewards.png "Figure: Mean episode reward (y-axis) and win rate(percentages) across 5 MiniGrid environments; error bars denote 95% percentile confidence intervals. ")

Performance scales with LLM capability - weaker models often fail to cross the threshold needed to synthesize a usable world model, while stronger ones reach comparable results and degrades when semantic information about the environment (object names, layout descriptions) is withheld.

The learned models maintain meaningful beliefs. As the agent gathers observations, its belief entropy drops and the posterior mass concentrates on the true latent state - exactly what you need for planning under uncertainty.

![Pinductor pipeline](../assets/posts/pinductor/e1_belief_entropy.png "Figure:  Left: belief entropy over episode steps. Right: posterior mass on the true hidden state and MAP-belief accuracy")

## Why It Matters

Pinductor shows that language-model priors are powerful enough to compensate for the loss of ground-truth state supervision. By grounding LLM-generated code in a belief-based evaluation signal, we can learn sample-efficient, interpretable, and executable POMDP models in strictly partial-observable settings.
