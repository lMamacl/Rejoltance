using System.Text.Json.Serialization;

namespace Rejoltance.Contracts;

/// <summary>
/// The only thing a client (human or bot) may send into a match. The server never accepts state.
/// Contract 1 of 5 (docs/03-architecture/MAP.md).
/// </summary>
[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(MulliganIntent), "mulligan")]
[JsonDerivedType(typeof(ChooseOrderIntent), "chooseOrder")]
[JsonDerivedType(typeof(PlayCardIntent), "playCard")]
[JsonDerivedType(typeof(EndStepIntent), "endStep")]
[JsonDerivedType(typeof(AnswerPendingIntent), "answerPending")]
[JsonDerivedType(typeof(SurrenderIntent), "surrender")]
public abstract record Intent;

/// <summary>Return the listed hand cards and draw replacements.</summary>
public sealed record MulliganIntent(IReadOnlyList<int> CardInstanceIds) : Intent;

/// <summary>Answer "do you want to go first?".</summary>
public sealed record ChooseOrderIntent(bool WantsFirst) : Intent;

/// <summary>Play a card from hand. <paramref name="Lane"/> is required for units (0..3).</summary>
public sealed record PlayCardIntent(int CardInstanceId, int? Lane, IReadOnlyList<TargetRef> Targets) : Intent;

/// <summary>End the active player's current step (units / mixed / actions).</summary>
public sealed record EndStepIntent : Intent;

/// <summary>Answer the current <see cref="PendingInteraction"/> (e.g. pre-combat target).</summary>
public sealed record AnswerPendingIntent(string PendingId, IReadOnlyList<TargetRef> Targets) : Intent;

public sealed record SurrenderIntent : Intent;

/// <summary>Reference to something a card can target. Exactly one field is set.</summary>
public sealed record TargetRef(int? UnitInstanceId = null, int? HeroSeat = null, int? HandCardInstanceId = null, int? ChoiceIndex = null);
