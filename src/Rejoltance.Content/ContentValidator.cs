namespace Rejoltance.Content;

/// <summary>Static checks on card and deck data. Returns every problem instead of stopping at the first.</summary>
public static class ContentValidator
{
    public static IEnumerable<string> ValidateCard(CardDefinition card)
    {
        var at = $"card {card.Id} '{card.Name}'";
        if (!Vocabulary.CardTypes.Contains(card.Type))
        {
            yield return $"{at}: unknown type '{card.Type}'";
        }

        if (card.IsUnit && (card.Attack is null || card.Health is null))
        {
            yield return $"{at}: unit without Attack/Health";
        }

        if (card.Cost < 0)
        {
            yield return $"{at}: negative cost";
        }

        foreach (var keyword in card.Keywords.Concat(card.KeywordParams.Keys).Where(k => !Vocabulary.Keywords.Contains(k)))
        {
            yield return $"{at}: unknown keyword '{keyword}'";
        }

        foreach (var effect in card.Effects)
        {
            if (!Vocabulary.Triggers.Contains(effect.Trigger))
            {
                yield return $"{at}: unknown trigger '{effect.Trigger}'";
            }

            if (effect.Zone is not null && !Vocabulary.Zones.Contains(effect.Zone))
            {
                yield return $"{at}: unknown zone '{effect.Zone}'";
            }

            if (effect.Condition is not null)
            {
                foreach (var problem in ValidateCondition(effect.Condition, at))
                {
                    yield return problem;
                }
            }

            foreach (var action in effect.Actions)
            {
                if (!Vocabulary.Actions.Contains(action.Type))
                {
                    yield return $"{at}: unknown action '{action.Type}'";
                }

                if (action.Target is not null && !Vocabulary.Targets.Contains(action.Target))
                {
                    yield return $"{at}: unknown target '{action.Target}' in {action.Type}";
                }

                if (action.StatusKeyword is not null && !Vocabulary.Keywords.Contains(action.StatusKeyword))
                {
                    yield return $"{at}: unknown status '{action.StatusKeyword}' in {action.Type}";
                }
            }
        }
    }

    public static IEnumerable<string> ValidateDeck(DeckDefinition deck, ICardCatalog catalog)
    {
        var at = $"deck '{deck.Name}'";
        if (deck.Cards.Count != CardRules.DeckSize)
        {
            yield return $"{at}: has {deck.Cards.Count} cards, expected {CardRules.DeckSize}";
        }

        foreach (var group in deck.Cards.GroupBy(id => id))
        {
            if (!catalog.TryGetCard(group.Key, out var card) || card is null)
            {
                yield return $"{at}: unknown card id {group.Key}";
                continue;
            }

            if (card.IsToken)
            {
                yield return $"{at}: token {card.Id} '{card.Name}' cannot be in a deck";
            }

            if (group.Count() > CardRules.MaxCopies)
            {
                yield return $"{at}: {group.Count()} copies of {card.Id} '{card.Name}' (max {CardRules.MaxCopies})";
            }
        }
    }

    private static IEnumerable<string> ValidateCondition(ConditionDefinition condition, string at)
    {
        if (!Vocabulary.Conditions.Contains(condition.Condition))
        {
            yield return $"{at}: unknown condition '{condition.Condition}'";
        }

        foreach (var problem in condition.SubConditions.SelectMany(sub => ValidateCondition(sub, at)))
        {
            yield return problem;
        }
    }
}
