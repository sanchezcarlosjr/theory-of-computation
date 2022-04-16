[Math Notes](https://sanchezcarlosjr.notion.site/Theory-of-Computation-1c30797e35f64e578e0c1961999ac6fe)

```puml
abstract class TransducerFiniteAutomaton
class MooreAutomaton
TransducerFiniteAutomaton <|-- MooreAutomaton
TransducerFiniteAutomaton <|-- MealyAutomaton

abstract class FiniteAutomaton {
   delta
   alphabet
   states
   startState
   actualState
   transite()
   accepts()
   reset()
}
class NondeterministicFiniteAutomaton {
  toDeterministicFiniteAutomaton()
}
class DeterministicFiniteAutomaton {
  minimize()
}
NondeterministicFiniteAutomaton --> DeterministicFiniteAutomaton
FiniteAutomaton <|-- NondeterministicFiniteAutomaton
FiniteAutomaton <|-- DeterministicFiniteAutomaton
DeterministicFiniteAutomaton --> MooreAutomaton
```