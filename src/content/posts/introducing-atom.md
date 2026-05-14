---
slug: pinductor
title: "Learning POMDP World Models from Observations with Language-Model Priors"
date: "2026-05-12"
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
### When Your AI Can't See the Whole Picture: Learning World Models with Language Priors

Imagine training a robot to navigate your home, but it can only see what's directly in front of it—no floor plans, no GPS, no peeking behind corners. How does it learn what to expect when it turns left or opens a door? This is the challenge of learning under *partial observability*, and it's exactly what the new paper **"Learning POMDP World Models from Observations with Language-Model Priors"** tackles. The authors introduce **Pinductor**, a method that lets agents build internal world models using only what they can observe, powered by the prior knowledge embedded in large language models.

Pinductor works by asking an LLM to propose executable code for a POMDP (Partially Observable Markov Decision Process)—essentially a probabilistic blueprint of how the world works. Instead of requiring ground-truth state labels (which are rarely available in real-world settings), the system evaluates these candidate models using a clever *belief-based likelihood score*: it checks whether the model's predicted observations, filtered through its own uncertainty, match what the agent actually saw. The LLM then iteratively refines the model based on this feedback, turning execution errors and mismatches into structured debugging hints.

![Pinductor pipeline](../assets/posts/pinductor/pinductor-pipeline.png)

The results are striking: despite using strictly less information than prior LLM-based methods that assume access to hidden states, Pinductor matches their performance and sample efficiency on MiniGrid benchmark tasks, while significantly outperforming traditional tabular approaches. Performance scales with LLM capability and degrades gracefully when semantic context is withheld—suggesting the method genuinely leverages language priors rather than just memorizing trajectories. This positions language models not just as chatbots or code generators, but as practical, sample-efficient priors for learning structured world models in the messy, partially observable settings where real agents actually operate.
