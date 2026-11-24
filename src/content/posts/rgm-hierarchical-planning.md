---
slug: rgm-hierarchical-planning
title: "Limitations of Renormalizing Generative Models as Hierarchical Planning Models"
date: "2026-10-20"
excerpt: "Renormalizing generative models learn an abstract predictive hierarchy. What it would take to turn it into an abstract control hierarchy for planning."
authors:
  - "Karim Zaghw"
  - "Lancelot Da Costa"
tags:
  - "Active Inference"
  - "Hierarchical Planning"
  - "World Models"
arxiv: "https://arxiv.org/abs/2608.09512"
github: "https://github.com/atomresearch/RGMs"
relatedPaperIds:
  - "rgm-active-inference"
---

This note assumes familiarity with Renormalizing Generative Models (RGMs) ([Zaghw et al., 2026](https://arxiv.org/abs/2608.09512); [Pashea & Zaghw, 2026](https://github.com/atomresearch/RGMs)), especially the fast structure learning procedure ([Friston et al., 2025a](https://doi.org/10.3389/fnetp.2025.1521963); [Friston et al., 2025b](https://doi.org/10.3390/e27090992); [Zaghw et al., 2026](https://arxiv.org/abs/2608.09512)). The aim is not to rederive the construction, but to clarify how the learned hierarchy should and should not be interpreted for planning.

Throughout the note, $o$ denotes sensory observations, $s^{(1)}$ denotes first-level hidden states, and $s^{(2)}$ denotes second-level hidden states. A learned higher-level path label is written as $u^{(2)}$. A controllable high-level action or option is written as $\beta^{(2)}$. This distinction is important: a learned path label is not automatically a controllable option.

Fast structure learning constructs a hierarchy of predictive models. It groups lower-level variables, turns observed local pattern classes into higher-level states, learns path-conditioned transitions among those states, and passes state/path summaries upward. Read downward, higher-level states provide empirical priors over lower-level initial states and paths through the learned $D$ and $E$ mappings.

This construction supports hierarchical inference and prediction. It does not, by itself, establish a valid hierarchy of controllable actions. The central distinction is that observed coarse transitions are not automatically equivalent to controllable high-level actions. The distinction matters because hierarchical planning requires more than a compressed predictive model. A useful planning abstraction must keep the information needed to choose good actions, and it must separate changes the agent can cause from changes it can only observe.

## Statistical Compression as an Assumption

Fast structure learning builds its state and path labels from the training stream. A higher-level state labels a local pattern that appeared in the data. A higher-level path labels a transition branch that appeared in the data. The learned hierarchy therefore reflects what was observed during structure learning.

Consider a local first-level configuration made of two first-level factors,

$$
s_{\mathrm{loc}}^{(1)}
=
(s_a^{(1)},s_b^{(1)}).
$$

If $s_a^{(1)}$ has $K_a$ values and $s_b^{(1)}$ has $K_b$ values, the full local configuration space contains $K_aK_b$ configurations. If all configurations appear in the training data and each configuration receives its own second-level label, then the induced second-level state space satisfies

$$
K^{(2)} = K_aK_b.
$$

In that case, the second-level state is primarily a relabelling of the first-level joint configuration. There is no substantive state-space compression.

If only a subset of configurations appears, then

$$
K^{(2)} < K_aK_b.
$$

This reduction has two possible meanings. In the favourable case, it is genuine compression: the omitted or merged distinctions do not matter for later inference or control. In the weaker case, it is only support restriction: the model has fewer states because it only represents the configurations that occurred in the training stream. Fast structure learning does not, by itself, show which interpretation is correct.

This matters for generalization. If a new first-level configuration appears during later inference, the model does not create a new second-level pattern state for it. Instead, it tries to explain the new configuration using the likelihoods of the second-level states it already learned. The posterior may become spread across several existing states, or the observation may simply fit the model poorly. A new hidden state would require structure learning to be rerun or extended. The same issue applies to paths: if a useful first-level transition never appeared in the training stream, it will not be available as a second-level path label.

The statistical compression assumption is therefore that the coarse states and transitions seen during training are enough for the later task. This assumption may be reasonable in restricted domains. It may also be exactly where the computational savings come from: the model plans only with a smaller set of learned coarse states and paths. But it should be stated explicitly. The learned hierarchy does not guarantee that every reachable, useful, or task-relevant first-level possibility has been represented. This suggests that fast structure learning should be extended to work at test time, enabling continual learning of the hierarchy.

## Preference Lifting

Fast structure learning does not automatically specify how preferences should be used at higher levels of the hierarchy. In standard active-inference planning, preferences are usually defined over observations. For example, if the preferred observation distribution is $p^*(o)$, then a first-level path $u^{(1)}$ can be scored through the utility term in the expected free-energy

$$
-\mathbb E_{q(o\mid u^{(1)})}
[
\log p^*(o)
].
$$

This does not require a separate preference distribution over first-level states. The first-level model predicts observations under each candidate path and compares those predicted observations directly with $p^*(o)$.

The issue appears when planning is moved up one level. A second-level planner does not directly choose among predicted observations. It chooses among second-level paths and predicts second-level states. These second-level states generate or predict first-level states. Therefore, to evaluate second-level plans, the model needs a way to say which first-level states are valuable.

One way to construct this value is to use the first-level likelihood. A first-level state $s^{(1)}$ can be assigned a value by averaging the original observation preference over the observations it predicts:

$$
V(s^{(1)})
=
\sum_o
P(o\mid s^{(1)})
\log p^*(o).
$$

This induces a preference over first-level states:

$$
p^*(s^{(1)})
\propto
\exp V(s^{(1)}).
$$

A second-level state $s^{(2)}$ can then be scored through the first-level states it predicts. If the second-level state predicts first-level states through $P(s^{(1)}\mid s^{(2)})$, its value can be written as

$$
V(s^{(2)})
=
\sum_{s^{(1)}}
P(s^{(1)}\mid s^{(2)})
\log p^*(s^{(1)}).
$$

This is the preference-lifting step. It converts preferences over observations into preferences over first-level states, so that second-level planning can evaluate abstract states and paths.

The caveat is that this only works well if the abstraction preserves value-relevant distinctions. Suppose two first-level states, $s_a^{(1)}$ and $s_b^{(1)}$, are both generated by the same second-level state $s^{(2)}$. If $s_a^{(1)}$ tends to generate preferred observations but $s_b^{(1)}$ tends to generate dispreferred observations, then the value of $s^{(2)}$ averages over an important difference. The high-level planner may no longer know whether moving toward $s^{(2)}$ is good or bad.

Thus preference lifting is not merely a notational issue. A higher-level state can be assigned a value through the lower-level states and observations it predicts, but this value is useful for planning only if the higher-level abstraction has not merged lower-level states that should remain separate for the task. This suggests one should perhaps incorporate value in the way states are lumped together in future work.

This is a real gap, but the required object is clear: a decoder or value map from higher-level states to the lower-level variables on which preferences are defined. The deeper problem is whether the learned higher-level paths have valid control semantics, as we'll see next.

## Learned Paths Are Not Automatically Actions

In an RGM, a path value selects one transition rule:

$$
P(s_{t+1}\mid s_t,u_t).
$$

At the second level, this means that a learned path label $u^{(2)}$ selects a transition among second-level states. If a path is marked as controllable, the reference planning routine can score that path using expected free energy. In that case, the agent can choose among path values.

The issue is that fast structure learning does not learn which transitions are interventions. It learns which transitions were observed in the training stream. A learned path $u^{(2)}$ therefore means “this second-level transition occurred,” not necessarily “the agent can choose this second-level transition.”

This is enough for prediction, but not for action.

The problem appears when an observed transition combines controllable and uncontrollable changes. If the whole transition is treated as a selectable high-level path, the planner may treat an exogenous change as if it were under the agent’s control.

For example, suppose a second-level state labels a first-level configuration with two components:

$$
s_{\mathrm{loc}}^{(1)}
=
(r,h),
$$

where $r$ is the weather state and $h$ is the umbrella state. Rain is exogenous, while the umbrella state is controllable. Suppose the training stream contains the coarse transition

$$
(\text{rain},\text{open})
\to
(\text{dry},\text{closed}).
$$

Fast structure learning can assign this transition a path label $u^{(2)}$. As a prediction, this is fine: this transition occurred in the data. But as an action, it is wrong. Selecting this path would mean selecting both that the umbrella closes and that the rain stops.

A valid controllable option should only control the umbrella, for example

$$
\beta^{(2)}
=
\text{close umbrella}.
$$

The weather dynamics should remain exogenous:

$$
P(r',h'\mid r,h,\beta^{(2)})
=
P(r'\mid r)
P(h'\mid r,h,\beta^{(2)}),
$$

where $r$ denotes the weather state and $h$ denotes the umbrella state. The controllable option $\beta^{(2)}$ can influence $h'$, but it should not directly select $r'$.

Thus the main limitation of the current RGM is:

$$
\text{learned path label } u^{(2)}
\not\Rightarrow
\text{controllable option } \beta^{(2)}.
$$

A further classification step is required. Each learned path must be interpreted as either a controllable option, an exogenous transition mode, or a mixed statistical transition that should not be selected as a single action. Fast structure learning does not provide this classification by itself. In future work, fast structure learning could be adapted to not bundle controllable and uncontrollable states together.

## Controllable and Uncontrollable Factors

One possible response is to keep controllable and uncontrollable factors separate during structure learning. For example, the model could learn one second-level factor for controllable state and another for uncontrollable context:

$$
s_{\mathrm{ctrl}}^{(2)}
=
\text{controllable state},
\qquad
s_{\mathrm{ctx}}^{(2)}
=
\text{uncontrollable context}.
$$

Paths of $s_{\mathrm{ctrl}}^{(2)}$ could then be treated as possible controllable options, while paths of $s_{\mathrm{ctx}}^{(2)}$ would be inferred as exogenous context. This helps avoid treating a mixed context-control transition as a single action. However, this separation does not solve the whole problem.

The first issue is value dependence. Suppose the observation is

$$
o \in \{\text{dry},\text{wet}\},
$$

and $\text{wet}$ is strongly unpreferred. Let the relevant hidden state have two components,

$$
(r,h),
$$

where $r$ is the weather state and $h$ is the umbrella state. The observation $\text{wet}$ depends on these variables jointly. For example,

$$
P(o=\text{wet}\mid r=\text{rain},h=\text{closed}) \approx 1,
$$

but

$$
P(o=\text{wet}\mid r=\text{rain},h=\text{open}) \approx 0,
$$

and

$$
P(o=\text{wet}\mid r=\text{dry},h=\text{closed}) \approx 0.
$$

Thus the bad outcome is not caused by rain alone or by a closed umbrella alone. It is caused by their combination.

This matters for preference lifting. If preferences are lifted to the joint state $(r,h)$, there is no problem: the joint state $(\text{rain},\text{closed})$ receives low value, while $(\text{rain},\text{open})$ and $(\text{dry},\text{closed})$ do not. But if preference lifting produces separate preferences over $r$ and $h$ by marginalizing out the other variable, then information is lost. The model is forced to assign a value to rain without knowing whether the umbrella is open, and a value to the umbrella state without knowing whether it is raining.

In other words, the true value has the form

$$
V(r,h),
$$

but a separated preference representation approximates it by something like

$$
V_r(r) + V_h(h).
$$

This approximation cannot exactly represent the fact that only the combination $(\text{rain},\text{closed})$ is bad. Therefore, separating controllable and uncontrollable factors can make preference lifting approximate whenever preferences depend on their joint consequences for observations. This suggests that preference lifting should not use this sort of (mean-field) approximation, marginalizing across factors.

The second issue is transition dependence. Suppose the controllable state is location, with values $\text{outside}$ and $\text{inside}$, and the contextual state is door status, with values $\text{locked}$ and $\text{unlocked}$. The option

$$
\beta^{(2)}=\text{enter}
$$

changes the location only if the door is unlocked. If the door is locked, the same option fails. The correct transition structure is therefore not

$$
P(s_{\mathrm{ctrl},t+1}^{(2)}
\mid
s_{\mathrm{ctrl},t}^{(2)},
\beta_t^{(2)}),
$$

but

$$
P(s_{\mathrm{ctrl},t+1}^{(2)}
\mid
s_{\mathrm{ctrl},t}^{(2)},
s_{\mathrm{ctx},t}^{(2)},
\beta_t^{(2)}).
$$

A general POMDP can represent this in two ways. A tabular POMDP can lump location and door status into one joint state. A factored POMDP can keep them separate while allowing the transition of location to depend on door status. In both cases, the model preserves the dependence between the controllable transition and the uncontrollable context.

The standard RGM construction does not naturally provide this second option. Its factorization does not introduce arbitrary conditional dependencies between factors at the same level. If the transition from outside to inside depends on whether the door is locked, the straightforward RGM representation is therefore to combine location and door status into a single joint factor. This suggests the need for factored RGMs that keep track of conditional dependencies across factors.

But this creates a tension. If location and door status are lumped together, then the model has preserved the context dependence, but it has no longer cleanly separated controllable state from uncontrollable context. If they are separated, then the model can distinguish what is controllable from what is contextual, but it risks losing the conditional transition structure that makes the action model correct.

This is why separating controllable and uncontrollable factors is not sufficient. It prevents one error, namely treating exogenous changes as actions. But it does not guarantee that the model learns how exogenous context changes the effects of controllable actions. Fast structure learning learns empirical states and empirical transition labels from passive data. It does not by itself learn the causal or conditional control structure needed to say that the option $\text{enter}$ succeeds when the door is unlocked and fails when the door is locked.

Thus the repair is not simply to group only controllable factors together. The stronger requirement is to preserve the dependency scope needed for control. The model must represent what the agent can choose, what it must condition on, and how contextual variables change both the value and the consequences of controllable options.

## Conclusion

Fast structure learning constructs an abstract predictive hierarchy. This hierarchy can support prediction, hierarchical inference, and empirical priors across scales. It should not automatically be interpreted as an abstract control hierarchy.

The computational motivation for hierarchical planning is that a high-level transition can stand for a lower-level episode. A flat planner over horizon $H^{(2)}H^{(1)}$ faces a primitive policy space on the order of

$$
|\mathcal U^{(1)}|^{H^{(2)}H^{(1)}}.
$$

An ideal two-level planner would replace this with a cost closer to

$$
|\mathcal U^{(2)}|^{H^{(2)}}
+
H^{(2)}|\mathcal U^{(1)}|^{H^{(1)}}.
$$

This reduction is meaningful only if the high-level action space is much smaller than the space of lower-level policy fragments:

$$
|\mathcal U^{(2)}|
\ll
|\mathcal U^{(1)}|^{H^{(1)}}.
$$

Fast structure learning can produce a small empirical set of second-level path labels,

$$
\mathcal P_{\mathrm{FSL}}^{(2)}
\subseteq
(\mathcal U^{(1)})^{H^{(1)}}.
$$

However, a small empirical path set is not necessarily a valid option set. The computational savings are justified only if the learned paths are representative, task-relevant, correctly separated into controllable and exogenous modes, and supplied with lower-level implementations when treated as controllable options.

The main limitations are therefore:

1. The compression is statistical and depends on the representativeness of the training stream.
1. Low-level preferences must be lifted through a suitable decoder or value map.
1. Preference lifting can become approximate if value depends on combinations of factors but preferences are represented separately over those factors.
1. Learned path labels $u^{(2)}$ must be classified as controllable options $\beta^{(2)}$, exogenous transition modes, or mixed statistical transitions.
1. Contextual variables may need to modulate the value and consequences of controllable options.

The concise conclusion is:

$$
\text{fewer learned paths}
\neq
\text{valid planning abstraction}.
$$

Equivalently, RGMs learn an abstract predictive hierarchy, whereas hierarchical planning requires an abstract control hierarchy.

This distinction preserves the value of the RGM construction while clarifying its current limitation. RGMs build hierarchical models of observed structure. Additional mechanisms, such as those mentioned in this post, are required before the learned hierarchy can be treated as a hierarchy of valid actions.

## References

- Friston, K., Heins, C., Verbelen, T., Da Costa, L., Salvatori, T., Markovic, D., Tschantz, A., Koudahl, M., Buckley, C., & Parr, T. (2025a). From pixels to planning: scale-free active inference. *Frontiers in Network Physiology*, 5. [doi:10.3389/fnetp.2025.1521963](https://doi.org/10.3389/fnetp.2025.1521963)
- Friston, K., Parr, T., Heins, C., Da Costa, L., Salvatori, T., Tschantz, A., Koudahl, M., Van de Maele, T., Buckley, C., & Verbelen, T. (2025b). Gradient-free de novo learning. *Entropy*, 27(9), 992. [doi:10.3390/e27090992](https://doi.org/10.3390/e27090992)
- Pashea, A., & Zaghw, K. (2026). RGMs: a Python library for renormalising generative models. [github.com/atomresearch/RGMs](https://github.com/atomresearch/RGMs)
- Zaghw, K., Pashea, A., Pritsch, M., Nuijten, W., Friston, K., & Da Costa, L. (2026). Renormalising generative models for active inference: foundations, derivations, and verification. [arXiv:2608.09512](https://arxiv.org/abs/2608.09512)
